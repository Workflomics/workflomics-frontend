create role web_anon nologin;

grant usage on schema public to web_anon;
grant select on public.domain to web_anon;
grant select on public.domain_topics to web_anon;
grant select on public.topic_of_research to web_anon;

grant web_anon to app_user;
