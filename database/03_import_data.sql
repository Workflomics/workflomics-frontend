--
-- Data for Name: domain; Type: TABLE DATA; Schema: public; Owner: app_user
--

INSERT INTO public.domain VALUES (1, 'proteomics', 'https://raw.githubusercontent.com/Workflomics/tools-and-domains/refs/heads/main/domains/proteomics/config.json', true, 'Domain comprises fully executable operations used in Proteomics from the bio.tools registry.', true);
INSERT INTO public.domain VALUES (2, 'proteomics non-executable', 'https://raw.githubusercontent.com/Workflomics/tools-and-domains/main/domains/non-executable-domains/proteomics/config.json', true, 'The domain encompasses non-executable Proteomics operations from the bio.tools registry, enabling exploration of potential workflows in this field.', false);
INSERT INTO public.domain VALUES (3, 'MSI', 'https://raw.githubusercontent.com/Workflomics/tools-and-domains/refs/heads/msi/domains/MSI/config.json', true, 'Domain comprises fully executable operations used in (mass spectrometry) Imaging (MSI) from the bio.tools registry.', true);


--
-- Data for Name: permission; Type: TABLE DATA; Schema: public; Owner: app_user
--

INSERT INTO public.permission VALUES (1, 'generate_workflows', 0, 'User can browse public domains and generate workflows.');
INSERT INTO public.permission VALUES (2, 'control_personal_history', 1, 'The user can create and edit personal history.');
INSERT INTO public.permission VALUES (3, 'upload_benchmarked_data', 1, 'User can upload results of local workflow execution.');
INSERT INTO public.permission VALUES (4, 'own_domains', 10, 'User can own and be a maintainer of scientific domains.');
INSERT INTO public.permission VALUES (5, 'curate_owned_domains', 10, 'User can edit the scientific domains affiliated with.');
INSERT INTO public.permission VALUES (6, 'admin_domains', 1000, 'User can edit any domain on the platform.');
INSERT INTO public.permission VALUES (7, 'admin_users', 1000, 'User can edit user data of other users.');
INSERT INTO public.permission VALUES (8, 'execute_workflows', 100, 'User can access the provided benchmarking cloud services to benchmark workflows');


--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: app_user
--

INSERT INTO public.role VALUES (1, 'user', 'A user that can generate workflows, browse history of generated workflows and upload and visualise benchmarking results');
INSERT INTO public.role VALUES (2, 'admin', 'User that has full access to the platform.');
INSERT INTO public.role VALUES (3, 'curator', 'User that can be associated with domans and modify them.');


--
-- Data for Name: role_permission; Type: TABLE DATA; Schema: public; Owner: app_user
--

INSERT INTO public.role_permission VALUES (1, 1, 3);
INSERT INTO public.role_permission VALUES (2, 1, 2);
INSERT INTO public.role_permission VALUES (3, 1, 1);
INSERT INTO public.role_permission VALUES (4, 3, 1);
INSERT INTO public.role_permission VALUES (5, 3, 2);
INSERT INTO public.role_permission VALUES (6, 3, 3);
INSERT INTO public.role_permission VALUES (7, 3, 4);
INSERT INTO public.role_permission VALUES (8, 3, 5);
INSERT INTO public.role_permission VALUES (9, 2, 1);
INSERT INTO public.role_permission VALUES (10, 2, 2);
INSERT INTO public.role_permission VALUES (11, 2, 3);
INSERT INTO public.role_permission VALUES (12, 2, 4);
INSERT INTO public.role_permission VALUES (13, 2, 5);
INSERT INTO public.role_permission VALUES (14, 2, 6);
INSERT INTO public.role_permission VALUES (15, 2, 7);
INSERT INTO public.role_permission VALUES (16, 2, 8);


--
-- Data for Name: topic_of_research; Type: TABLE DATA; Schema: public; Owner: app_user
--

INSERT INTO public.topic_of_research VALUES (2, 'Omics', 'http://edamontology.org/topic_0121', 5);
INSERT INTO public.topic_of_research VALUES (3, 'Metabolomics', 'http://edamontology.org/topic_0121', 5);
INSERT INTO public.topic_of_research VALUES (4, 'Proteomics', 'http://edamontology.org/topic_0121', 5);
INSERT INTO public.topic_of_research VALUES (5, 'Imaging', 'http://edamontology.org/topic_3382', 5);

--
-- Data for Name: domain_topics; Type: TABLE DATA; Schema: public; Owner: app_user
--

INSERT INTO public.domain_topics VALUES (2, 2);
INSERT INTO public.domain_topics VALUES (2, 4);
INSERT INTO public.domain_topics VALUES (3, 5);
INSERT INTO public.domain_topics VALUES (3, 2);
INSERT INTO public.domain_topics VALUES (1, 2);
INSERT INTO public.domain_topics VALUES (1, 4);