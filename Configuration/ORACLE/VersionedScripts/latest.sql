CREATE TABLE "SyncRS_PermissionAccess"(
	"Id" int PRIMARY KEY NOT NULL,
	"Name" NVARCHAR2(100) NOT NULL UNIQUE,
	"AccessId" int NOT NULL,
	"IsActive" NUMBER(1) NOT NULL )
;

CREATE SEQUENCE "SyncRS_PermissionAccess_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

CREATE TABLE "SyncRS_PermissionAccEntity"(
	"Id" int PRIMARY KEY NOT NULL,
	"PermissionEntityId" int NOT NULL,
	"PermissionAccessId" int NOT NULL,
	"IsActive" NUMBER(1) NOT NULL )
;

CREATE SEQUENCE "SyncRS_PermissionAccEntity_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncRS_PermissionAccEntity"  ADD FOREIGN KEY("PermissionEntityId") REFERENCES "SyncRS_PermissionEntity" ("Id")
;
ALTER TABLE "SyncRS_PermissionAccEntity"  ADD FOREIGN KEY("PermissionAccessId") REFERENCES "SyncRS_PermissionAccess" ("Id")
;

INSERT into "SyncRS_PermissionAccess" ("Id","Name","AccessId","IsActive") VALUES ("SyncRS_PermissionAccess_seq".nextval,'Create',1,1)
;
INSERT into "SyncRS_PermissionAccess" ("Id","Name","AccessId","IsActive") VALUES ("SyncRS_PermissionAccess_seq".nextval,'Read',2,1)
;
INSERT into "SyncRS_PermissionAccess" ("Id","Name","AccessId","IsActive") VALUES ("SyncRS_PermissionAccess_seq".nextval,'Read, Write',6,1)
;
INSERT into "SyncRS_PermissionAccess" ("Id","Name","AccessId","IsActive") VALUES ("SyncRS_PermissionAccess_seq".nextval,'Read, Write, Delete',14,1)
;
INSERT into "SyncRS_PermissionAccess" ("Id","Name","AccessId","IsActive") VALUES ("SyncRS_PermissionAccess_seq".nextval,'Read, Download',18,1)
;
INSERT into "SyncRS_PermissionAccess" ("Id","Name","AccessId","IsActive") VALUES ("SyncRS_PermissionAccess_seq".nextval,'Read, Write, Download',22,1)
;
INSERT into "SyncRS_PermissionAccess" ("Id","Name","AccessId","IsActive") VALUES ("SyncRS_PermissionAccess_seq".nextval,'Read, Write, Delete, Download',30,1)
;

INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,4,1,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,6,1,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,10,1,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,1,1,1)
;
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,2,1,1)
;	
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,17,1,1)
;																										  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,8,1,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,1,2,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,2,2,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,3,2,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,4,2,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,5,2,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,10,2,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,11,2,1)
;																											  																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,4,3,1)
;																														  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,5,3,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,10,3,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,11,3,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,4,4,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,5,4,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,10,4,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,11,4,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,1,5,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,2,5,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,3,5,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,17,5,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,18,5,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,6,5,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,7,5,1)
;	
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,8,5,1)
;
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,9,5,1)
;																										  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,1,6,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,2,6,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,3,6,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,17,6,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,18,6,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,6,6,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,7,6,1)
;
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,8,6,1)
;
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,9,6,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,1,7,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,2,7,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,3,7,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,6,7,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,7,7,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,17,7,1)
;																											  
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,18,7,1)
;
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,8,7,1)
;
INSERT INTO "SyncRS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES ("SyncRS_PermissionAccEntity_seq".nextval,9,7,1)
;

UPDATE "SyncRS_UserPermission" SET "PermissionAccessId"='18' WHERE "PermissionAccessId"='2' AND "PermissionEntityId" NOT IN ('4', '5', '10', '11', '19', '20')
;
UPDATE "SyncRS_UserPermission" SET "PermissionAccessId"='22' WHERE "PermissionAccessId"='6' AND "PermissionEntityId" NOT IN ('4', '5', '10', '11', '19', '20')
;
UPDATE "SyncRS_UserPermission" SET "PermissionAccessId"='30' WHERE "PermissionAccessId"='14' AND "PermissionEntityId" NOT IN ('4', '5', '10', '11', '19', '20')
;

UPDATE "SyncRS_GroupPermission" SET "PermissionAccessId"='18' WHERE "PermissionAccessId"='2' AND "PermissionEntityId" NOT IN ('4', '5', '10', '11', '19', '20')
;
UPDATE "SyncRS_GroupPermission" SET "PermissionAccessId"='22' WHERE "PermissionAccessId"='6' AND "PermissionEntityId" NOT IN ('4', '5', '10', '11', '19', '20')
;
UPDATE "SyncRS_GroupPermission" SET "PermissionAccessId"='30' WHERE "PermissionAccessId"='14' AND "PermissionEntityId" NOT IN ('4', '5', '10', '11', '19', '20')
;

ALTER TABLE "SyncRS_ItemCommentLogType" ADD UNIQUE ("Name")
;
ALTER TABLE "SyncRS_ExportType" ADD UNIQUE ("Name")
;
ALTER TABLE "SyncRS_ItemLogType" ADD UNIQUE ("Name")
;
ALTER TABLE "SyncRS_ItemType" ADD UNIQUE ("Name")
;
ALTER TABLE "SyncRS_PermissionEntity" ADD UNIQUE ("Name")
;
ALTER TABLE "SyncRS_RecurrenceType" ADD UNIQUE ("Name")
;
ALTER TABLE "SyncRS_SystemLogType" ADD UNIQUE ("Name")
;
ALTER TABLE "SyncRS_UserLogType" ADD UNIQUE ("Name")
;
ALTER TABLE "SyncRS_UserType" ADD UNIQUE ("Type")
;
INSERT into "SyncRS_ExportType" ("Id","Name","IsActive") VALUES ("SyncRS_ExportType_seq".nextval,'CSV', 1)
;
INSERT into "SyncRS_RecurrenceType" ("Id","Name","IsActive") VALUES ("SyncRS_RecurrenceType_seq".nextval,'Hourly',1)
;
ALTER TABLE "SyncRS_SAMLSettings" ADD "MobileAppId" VARCHAR2(100)
;
DROP TABLE "SyncRS_DashboardWidget"
;
DROP SEQUENCE "SyncRS_DashboardWidget_seq"
;