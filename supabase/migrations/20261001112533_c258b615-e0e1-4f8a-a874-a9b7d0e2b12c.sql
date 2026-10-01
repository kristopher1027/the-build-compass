CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can read their own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Members can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can read their own role" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

CREATE TABLE public.knowledge_entries (
  id text PRIMARY KEY,
  title text NOT NULL CHECK (char_length(title) BETWEEN 2 AND 160),
  category text NOT NULL CHECK (category IN ('History','Rulers','Clans','LGAs','Festivals','Proverbs','Greetings','Tourist Sites','Cultural Practices')),
  content text NOT NULL CHECK (char_length(content) BETWEEN 10 AND 10000),
  tags text[] NOT NULL DEFAULT '{}',
  is_published boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.knowledge_entries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.knowledge_entries TO authenticated;
GRANT ALL ON public.knowledge_entries TO service_role;
ALTER TABLE public.knowledge_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published knowledge is public" ON public.knowledge_entries FOR SELECT TO anon USING (is_published = true);
CREATE POLICY "Members read published knowledge" ON public.knowledge_entries FOR SELECT TO authenticated USING (is_published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Administrators add knowledge" ON public.knowledge_entries FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Administrators edit knowledge" ON public.knowledge_entries FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Administrators remove knowledge" ON public.knowledge_entries FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER knowledge_entries_set_updated_at BEFORE UPDATE ON public.knowledge_entries FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  assigned_role public.app_role;
BEGIN
  PERFORM pg_advisory_xact_lock(718221);
  assigned_role := CASE WHEN EXISTS (SELECT 1 FROM public.user_roles) THEN 'user'::public.app_role ELSE 'admin'::public.app_role END;
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(COALESCE(NEW.email, ''), '@', 1)));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, assigned_role);
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

INSERT INTO public.knowledge_entries (id, title, category, content, tags) VALUES
('origin-apa','Apa — where we came from','History','Our fathers say we came from Apa, a great kingdom that once stood in the middle Benue valley — kin to the Jukun and Kwararafa. When Apa fell, the clans scattered south, following the rivers, and settled the land we now call Ai wa (our home). Every Idoma child, no matter the clan, will hear at some point: ''wa lù Apa'' — ''we come from Apa.''',ARRAY['apa','kwararafa','migration','jukun','origins','ai wa']),
('colonial-era','When the British came','History','The white men reached our clans in the early 1900s. In 1927 they bundled us under one ''Idoma Native Authority'' with the headquarters at Otukpo — that was the first time all our clans answered to one desk. It was not our idea, but it is what allowed us, twenty years later in 1948, to raise up one stool: the Ọch''Idoma.',ARRAY['colonial','1927','1948','native authority','otukpo']),
('benue-state','Ai wa inside Benue','History','Benue State was carved out on the 3rd of February, 1976. We — the Idoma — sit in the south, what the state calls Zone C; our Tiv brothers hold the north and centre. When people talk of ''southern Benue,'' they are talking of us: roughly nine local governments, one language with many dialects, one people.',ARRAY['benue','1976','zone c','tiv']),
('och-idoma','Ọch''Idoma — the one stool of Ai wa','Rulers','The Ọch''Idoma is our paramount father, seated at Otukpo. We raised the stool in 1948 so the clans could speak with one mouth. The first was Ogiri Oko (1948–1960); after him came Ajene Okpabi, Abraham Ajene Okpabi, Elias Ikoyi Obekpa, and today Agabaidu Prof. John Elaigwu Odogbo sits on it. We call him Agabaidu — ''the great one.''',ARRAY['och''idoma','ochidoma','paramount','otukpo','agabaidu']),
('clan-chiefs','Ọch''Ai — the chief of each clan','Rulers','Before the Ọch''Idoma, we already had our own — Ọch''Otukpo, Ọch''Ugbokolo, Ọch''Igumale, Ad''Ojira, and so on, one for each clan. These are the men who sit in council under the Ọch''Idoma. When a chief speaks in his own clan, his word is enough; when the whole of Ai wa must decide, they gather at Otukpo.',ARRAY['och''ai','council','clan chief']),
('clan-list','The clans of Ai wa','Clans','We are one people, but we are many clans (Ai). The big names you will hear are Otukpo, Adoka, Igumale, Ugbokolo, Orokam, Ochekwu, Ai-Ono, Edumoga, Ejigbo, Ito, Agatu, and Apa. Each clan has its own way of speaking Idoma — you can tell an Agatu man from an Orokam man the moment either opens his mouth — and each has its own shrine, its own festival dates, its own founder story.',ARRAY['clans','ai','otukpo','adoka','igumale','orokam','agatu']),
('clan-agatu','Agatu — our people by the river','Clans','The Agatu sit at the top edge of Ai wa, where the Benue river bends. They are our fishermen and rice farmers; their dialect drops sharper on the ear than ours further south. Their headquarters is Obagaji. When there is trouble on the river, it is Agatu voices we hear first.',ARRAY['agatu','obagaji','river benue']),
('lgas','The nine local governments of Ai wa','LGAs','On paper, Ai wa is Otukpo, Ohimini, Okpokwu, Ogbadibo, Ado, Apa, Agatu, Obi, and parts of Oju. Otukpo is the head — where the palace sits and where all roads meet. The others each carry their own clan character; ask any of us where we''re ''from'' and we''ll name our LGA before our state.',ARRAY['lga','otukpo','ohimini','okpokwu','ogbadibo','ado','apa','agatu','obi']),
('aje-alekwu','Aje-Alekwu — the night the ancestors come','Festivals','Once a year, in the dry season, we call our dead home. The compound is swept, palm wine is set on the shrine, and by night the masquerades — Alekwu wearing cloth — enter the square. The drums drop low. Children go quiet. In the morning we eat from one pot: it is one of the few days the whole clan is truly one household.',ARRAY['alekwu','ancestors','masquerade','aje']),
('eje-alago','Eje-Alago — thanking the yam','Festivals','After the main harvest, we do not just celebrate — we thank. The young men wrestle (ije) for the honour of their village, the girls dance in red and black, and the head of every household carries the first heap of yams to the compound shrine before anyone eats.',ARRAY['eje','harvest','wrestling','ije']),
('ito-ogwu','Ito Ogwu — the new yam','Festivals','Yam (ogwu) is our prestige crop; no man calls himself a farmer if he does not grow yam. Ito Ogwu is the day the first new yam is eaten. The Ọch'' of the clan tastes first, then the elders, then the households. Anyone who eats new yam before Ito Ogwu is done is said to be inviting hunger.',ARRAY['ito ogwu','new yam','ogwu','harvest']),
('proverb-elephant','Owo ọ̀nyi ka owo ọ̀nyi — ''one hand and one hand''','Proverbs','''One hand and one hand make a load.'' Ai wa uses this whenever cooperation is needed — carrying a yam heap, raising a child, settling a matter. No one carries alone.',ARRAY['proverb','unity']),
('proverb-patience','Owo ka i chogba — ''the hand that is not in a hurry''','Proverbs','''The hand that is not in a hurry will eat well.'' A word our fathers give young men who want everything at once. Patience feeds; hurry drops the yam.',ARRAY['proverb','patience']),
('greetings-basic','How Ai wa greets','Greetings','Ije oyi — ''you have arrived well,'' the closest thing we have to ''welcome home.'' Abo — hello. Nom̀ — thank you. Ada nwu? — ''how are you?'' We greet arrival before we greet anything else; to enter a compound without saying Ije oyi is to enter a stranger.',ARRAY['greeting','hello','welcome','thank you','ije oyi','abo']),
('greetings-elders','How we greet our elders','Greetings','To an older man we say Ada; to an older woman, Ene. A younger person bows slightly, uses both hands to receive anything from an elder, and never calls an elder by their first name alone. If you fail this in Ai wa, someone''s mother will correct you before your own.',ARRAY['elder','ada','ene','respect']),
('otukpo-town','Otukpo — where the roads end','Tourist Sites','Otukpo is the cultural head of Ai wa. The Ọch''Idoma''s palace is here; Idoma Day is celebrated here; and when a son of Ai wa wants to marry, it is often at Otukpo the two families meet. It is our largest town and our meeting point.',ARRAY['otukpo','palace','capital']),
('ojira-hills','Ojira Hills','Tourist Sites','Low green hills in Ohimini where our grandmothers still farm yam ridges. Old shrines sit among the rocks. Elders take newborns up at dawn to be ''shown'' to Alekwu.',ARRAY['ojira','hills','ohimini']),
('ogbadibo-caves','Ogbadibo Caves','Tourist Sites','Sandstone caves in Ogbadibo. Our fathers say Ai wa hid here during the wars from the north, and that some of our clan names were first spoken inside them.',ARRAY['caves','ogbadibo','migration']),
('alekwu','Alekwu — our ancestors, still present','Cultural Practices','Alekwu is not a god and not a ghost — Alekwu is our departed, gathered. They watch. They correct. They are called on at family shrines, at every serious matter, at every festival. When a masquerade dances in the square, that is Alekwu wearing cloth so we can see. To lie in front of Alekwu is to invite sickness on your own head.',ARRAY['alekwu','ancestors','religion','masquerade']),
('marriage','How we marry in Ai wa','Cultural Practices','Marriage is not two people; it is two families. First, ilo ọ́la — the introduction, where the young man''s people come to knock. Then the elders sit and settle bride-price (never rushed; always with palm wine and kola). Then the wedding, with dancing in ápà and gifts flowing between the two households. If either family is unwilling, no marriage happens — no matter what the two young people want.',ARRAY['marriage','bride price','wedding','kola']),
('foods','What we eat','Cultural Practices','Okoho soup — the stretchy soup made from okoho bark, eaten with pounded yam (utaba). That is the taste of home. Oka (maize dough), egwusi soup, bushmeat stews when the hunt is good, and palm wine (oyi) tapped fresh from the tree. Yam is king; no serious meal is served without it. When our diaspora children come home, it is okoho and utaba they ask for at the door.',ARRAY['food','okoho','pounded yam','utaba','oka','palm wine']),
('dress','Ápà — our red and black cloth','Cultural Practices','Ápà is the woven red-and-black cloth every Idoma person knows on sight. Men wrap it around the waist and over one shoulder; women wear it as a full wrapper. Coral beads at the neck, cowries at the wrist. The wedding cut, the burial cut, and the everyday cut are not the same — our tailors will tell you off if you order the wrong one.',ARRAY['dress','cloth','red and black','apa','beads']),
('language','Our language','Cultural Practices','Idoma is a tonal language — the same syllable can mean three different things depending on how you drop your voice. About 3 to 4 million of us speak it, across every clan of Ai wa. The Otukpo dialect is the one most people learn first, but Agatu, Adoka, Igumale, and Orokam each have their own tune. We say: if you cannot greet in Idoma, you cannot claim Idoma.',ARRAY['language','tonal','idomoid','benue-congo','dialect']);