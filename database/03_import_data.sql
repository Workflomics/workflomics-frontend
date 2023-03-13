INSERT INTO public."domain" (id,unique_label,repo_url,tool_annotations_file_name,ontology_file_name,docker_image_url,public) VALUES
	 (1,'proteomics','https://github.com/sanctuuary/APE_UseCases/tree/master/MassSpectometry','bio.tools_proteomics_domain.json','edam.owl',NULL,true),
	 (2,'metabolomics','https://github.com/sanctuuary/APE_UseCases/tree/dev/Metabolomics','tool_annotations.json','edam.owl',NULL,true);
INSERT INTO public."permission" (id,unique_label,permission_level,description) VALUES
	 (1,'generate_workflows',0,'User can browse public domains and generate workflows.'),
	 (2,'control_personal_history',1,'The user can create and edit personal history.'),
	 (3,'upload_benchmarked_data',1,'User can upload results of local workflow execution.'),
	 (4,'own_domains',10,'User can own and be a maintainer of scientific domains.'),
	 (5,'curate_owned_domains',10,'User can edit the scientific domains affiliated with.'),
	 (6,'admin_domains',1000,'User can edit any domain on the platform.'),
	 (7,'admin_users',1000,'User can edit user data of other users.'),
	 (8,'execute_workflows',100,'User can access the provided benchmarking cloud services to benchmark workflows');
INSERT INTO public.topic_of_research (id,unique_label,description,permission_id_required) VALUES
	 (1,'official','A tag that only administrators are allowed to add to a repository.',6),
	 (2,'omics',NULL,5),
	 (3,'metabolomics',NULL,5),
	 (4,'proteomics',NULL,5);
INSERT INTO public.domain_topics (domain_id,topic_id) VALUES
	 (1,1),
	 (1,2),
	 (1,4),
	 (2,2),
	 (2,3);
INSERT INTO public."role" (id,unique_label,description) VALUES
	 (1,'user','A user that can generate workflows, browse history of generated workflows and upload and visualise benchmarking results'),
	 (2,'admin','User that has full access to the platform.'),
	 (3,'curator','User that can be associated with domains and modify them.');
INSERT INTO public.role_permission (id,role_id_fk,permission_id_fk) VALUES
	 (1,1,3),
	 (2,1,2),
	 (3,1,1),
	 (4,3,1),
	 (5,3,2),
	 (6,3,3),
	 (7,3,4),
	 (8,3,5),
	 (9,2,1),
	 (10,2,2);
INSERT INTO public.role_permission (id,role_id_fk,permission_id_fk) VALUES
	 (11,2,3),
	 (12,2,4),
	 (13,2,5),
     (14,2,6),
     (15,2,7),
     (16,2,8);
