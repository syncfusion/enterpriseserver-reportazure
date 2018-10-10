INSERT into "SyncRS_ExportType" ("Id","Name","IsActive") VALUES ("SyncRS_ExportType_seq".nextval,'PPT', 1)
;

ALTER TABLE "SyncRS_User" ADD "PasswordChangedDate" DATE NULL
;

ALTER TABLE "SyncRS_PermissionEntity" ADD  "ItemTypeId" INT
;
UPDATE "SyncRS_PermissionEntity" SET "ItemTypeId"=3 WHERE "SyncRS_PermissionEntity"."Id" =1
;
UPDATE "SyncRS_PermissionEntity" SET "ItemTypeId"=1 WHERE "SyncRS_PermissionEntity"."Id" =2
;
UPDATE "SyncRS_PermissionEntity" SET "ItemTypeId"=3 WHERE "SyncRS_PermissionEntity"."Id" =3
;
UPDATE "SyncRS_PermissionEntity" SET "ItemTypeId"=1 WHERE "SyncRS_PermissionEntity"."Id" =4
;
UPDATE "SyncRS_PermissionEntity" SET "ItemTypeId"=1 WHERE "SyncRS_PermissionEntity"."Id" =5
;
UPDATE "SyncRS_PermissionEntity" SET "ItemTypeId"=4 WHERE "SyncRS_PermissionEntity"."Id" =6
;
UPDATE "SyncRS_PermissionEntity" SET "ItemTypeId"=4 WHERE "SyncRS_PermissionEntity"."Id" =7
;
UPDATE "SyncRS_PermissionEntity" SET "ItemTypeId"=6 WHERE "SyncRS_PermissionEntity"."Id" =8
;
UPDATE "SyncRS_PermissionEntity" SET "ItemTypeId"=6 WHERE "SyncRS_PermissionEntity"."Id" =9
;
UPDATE "SyncRS_PermissionEntity" SET "ItemTypeId"=7 WHERE "SyncRS_PermissionEntity"."Id" =10
;
UPDATE "SyncRS_PermissionEntity" SET "ItemTypeId"=7 WHERE "SyncRS_PermissionEntity"."Id" =11
;
UPDATE "SyncRS_PermissionEntity" SET "ItemTypeId"=2 WHERE "SyncRS_PermissionEntity"."Id" =12
;
UPDATE "SyncRS_PermissionEntity" SET "ItemTypeId"=1 WHERE "SyncRS_PermissionEntity"."Id" =13
;
UPDATE "SyncRS_PermissionEntity" SET "ItemTypeId"=2 WHERE "SyncRS_PermissionEntity"."Id" =14
;
UPDATE "SyncRS_PermissionEntity" SET "ItemTypeId"=8 WHERE "SyncRS_PermissionEntity"."Id" =15
;
UPDATE "SyncRS_PermissionEntity" SET "ItemTypeId"=8 WHERE "SyncRS_PermissionEntity"."Id" =16
;
UPDATE "SyncRS_PermissionEntity" SET "ItemTypeId"=5 WHERE "SyncRS_PermissionEntity"."Id" =17
;
UPDATE "SyncRS_PermissionEntity" SET "ItemTypeId"=5 WHERE "SyncRS_PermissionEntity"."Id" =18
;
UPDATE "SyncRS_PermissionEntity" SET "ItemTypeId"=9 WHERE "SyncRS_PermissionEntity"."Id" =19
;
ALTER TABLE "SyncRS_PermissionEntity" MODIFY COLUMN "ItemTypeId" INT NOT NULL
;
ALTER TABLE "SyncRS_PermissionEntity" ADD Foreign key("ItemTypeId") references "SyncRS_ItemType" ("Id")
;
ALTER TABLE "SyncRS_SAMLSettings" ADD "Authority" VARCHAR2(4000)
;
ALTER TABLE "SyncRS_SAMLSettings" ADD "DesignerClientId" VARCHAR2(100)
;
ALTER TABLE "SyncRS_SAMLSettings" ADD "TenantName" VARCHAR2(100)
;
ALTER TABLE "SyncRS_SystemSettings" ADD CONSTRAINT UK_SyncRS_SystemSettings_Key UNIQUE ("Key")
;