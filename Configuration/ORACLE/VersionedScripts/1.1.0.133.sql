CREATE TABLE "SyncRS_ProcessOption"(
	"Id" int PRIMARY KEY NOT NULL,
	"ItemId" NCHAR(36) NOT NULL,
	"ProcessOption" VARCHAR2(4000) NULL,
	"NextScheduleDate" DATE NULL,
	"CreatedDate" DATE NOT NULL,
	"ModifiedDate" DATE NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
;
CREATE SEQUENCE "SyncRS_ProcessOption_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncRS_ProcessOption"  ADD FOREIGN KEY("ItemId") REFERENCES "SyncRS_Item" ("Id")
;

CREATE TABLE "SyncRS_ProcessOptionMap"(
	"Id" int PRIMARY KEY NOT NULL,
	"ProcessOptionId" int NOT NULL,
	"ItemId" NCHAR(36) NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
;
CREATE SEQUENCE "SyncRS_ProcessOptionMap_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;
ALTER TABLE "SyncRS_ProcessOptionMap" ADD FOREIGN KEY("ProcessOptionId") REFERENCES "SyncRS_ProcessOption" ("Id")
;
ALTER TABLE "SyncRS_ProcessOptionMap" ADD FOREIGN KEY("ItemId") REFERENCES "SyncRS_Item" ("Id")
;
INSERT into "SyncRS_ItemType" ("Id","Name","IsActive") values ("SyncRS_ItemType_seq".nextval,'ItemView',1)
;
INSERT into "SyncRS_PermissionEntity" ("Id","Name","EntityType","IsActive") VALUES ("SyncRS_PermissionEntity_seq".nextval,'Specific ItemView',0, 1)
;
ALTER TABLE "SyncRS_ActiveDirectoryGroup" RENAME TO "SyncRS_ADGroup";

ALTER TABLE "SyncRS_ActiveDirectoryUser" RENAME TO "SyncRS_ADUser";

ALTER TABLE "SyncRS_ItemCommentLog" ADD "Url" VARCHAR2(4000) NOT NULL
;

ALTER TABLE "SyncRS_UserLogin" ADD "ClientToken_new" VARCHAR2(4000)
;
UPDATE "SyncRS_UserLogin" SET "ClientToken_new" = "ClientToken"
;
ALTER TABLE "SyncRS_UserLogin" DROP COLUMN "ClientToken"
;
ALTER TABLE "SyncRS_UserLogin" RENAME COLUMN "ClientToken_new" TO "ClientToken"
;
ALTER TABLE "SyncRS_UserLogin" MODIFY ("ClientToken" NOT NULL)
;

ALTER TABLE "SyncRS_UserPreference" ADD "Language_new" VARCHAR2(4000)
;
UPDATE "SyncRS_UserPreference" SET "Language_new" = "Language"
;
ALTER TABLE "SyncRS_UserPreference" DROP COLUMN "Language"
;
ALTER TABLE "SyncRS_UserPreference" RENAME COLUMN "Language_new" TO "Language"
;

ALTER TABLE "SyncRS_UserPreference" ADD "ItemSort_new" VARCHAR2(4000)
;
UPDATE "SyncRS_UserPreference" SET "ItemSort_new" = "ItemSort"
;
ALTER TABLE "SyncRS_UserPreference" DROP COLUMN "ItemSort"
;
ALTER TABLE "SyncRS_UserPreference" RENAME COLUMN "ItemSort_new" TO "ItemSort"
;

ALTER TABLE "SyncRS_UserPreference" ADD "ItemFilters_new" VARCHAR2(4000)
;
UPDATE "SyncRS_UserPreference" SET "ItemFilters_new" = "ItemFilters"
;
ALTER TABLE "SyncRS_UserPreference" DROP COLUMN "ItemFilters"
;
ALTER TABLE "SyncRS_UserPreference" RENAME COLUMN "ItemFilters_new" TO "ItemFilters"
;

ALTER TABLE "SyncRS_UserPreference" ADD "Notifications_new" VARCHAR2(4000)
;
UPDATE "SyncRS_UserPreference" SET "Notifications_new" = "Notifications"
;
ALTER TABLE "SyncRS_UserPreference" DROP COLUMN "Notifications"
;
ALTER TABLE "SyncRS_UserPreference" RENAME COLUMN "Notifications_new" TO "Notifications"
;

ALTER TABLE "SyncRS_ScheduleDetail" ADD "RecurrenceInfo_new" VARCHAR2(4000)
;
UPDATE "SyncRS_ScheduleDetail" SET "RecurrenceInfo_new" = "RecurrenceInfo"
;
ALTER TABLE "SyncRS_ScheduleDetail" DROP COLUMN "RecurrenceInfo"
;
ALTER TABLE "SyncRS_ScheduleDetail" RENAME COLUMN "RecurrenceInfo_new" TO "RecurrenceInfo"
;
ALTER TABLE "SyncRS_ScheduleDetail" MODIFY ("RecurrenceInfo" NOT NULL)
;

ALTER TABLE "SyncRS_SubscrExtnRecpt" ADD "EmailIds_new" VARCHAR2(4000)
;
UPDATE "SyncRS_SubscrExtnRecpt" SET "EmailIds_new" = "EmailIds"
;
ALTER TABLE "SyncRS_SubscrExtnRecpt" DROP COLUMN "EmailIds"
;
ALTER TABLE "SyncRS_SubscrExtnRecpt" RENAME COLUMN "EmailIds_new" TO "EmailIds"
;
ALTER TABLE "SyncRS_SubscrExtnRecpt" MODIFY ("EmailIds" NOT NULL)
;

ALTER TABLE "SyncRS_SystemSettings" ADD "Value_new" VARCHAR2(4000)
;
UPDATE "SyncRS_SystemSettings" SET "Value_new" = "Value"
;
ALTER TABLE "SyncRS_SystemSettings" DROP COLUMN "Value"
;
ALTER TABLE "SyncRS_SystemSettings" RENAME COLUMN "Value_new" TO "Value"
;

ALTER TABLE "SyncRS_Comment" ADD "Comment_new" VARCHAR2(4000)
;
UPDATE "SyncRS_Comment" SET "Comment_new" = "Comment"
;
ALTER TABLE "SyncRS_Comment" DROP COLUMN "Comment"
;
ALTER TABLE "SyncRS_Comment" RENAME COLUMN "Comment_new" TO "Comment"
;
ALTER TABLE "SyncRS_Comment" MODIFY ("Comment" NOT NULL)
;

ALTER TABLE "SyncRS_ItemCommentLog" ADD "OldValue_new" VARCHAR2(4000)
;
UPDATE "SyncRS_ItemCommentLog" SET "OldValue_new" = "OldValue"
;
ALTER TABLE "SyncRS_ItemCommentLog" DROP COLUMN "OldValue"
;
ALTER TABLE "SyncRS_ItemCommentLog" RENAME COLUMN "OldValue_new" TO "OldValue"
;

ALTER TABLE "SyncRS_ItemCommentLog" ADD "NewValue_new" VARCHAR2(4000)
;
UPDATE "SyncRS_ItemCommentLog" SET "NewValue_new" = "NewValue"
;
ALTER TABLE "SyncRS_ItemCommentLog" DROP COLUMN "NewValue"
;
ALTER TABLE "SyncRS_ItemCommentLog" RENAME COLUMN "NewValue_new" TO "NewValue"
;

ALTER TABLE "SyncRS_Item" ADD "IsPublic" NUMBER(1) DEFAULT (0) NOT NULL
;

ALTER TABLE "SyncRS_User" ADD "UserTypeId" int DEFAULT 0 NOT NULL
;

UPDATE "SyncRS_User" SET "UserTypeId" = 1 WHERE "SyncRS_User"."Id" In (SELECT "SyncRS_User"."Id" from "SyncRS_User" INNER JOIN "SyncRS_ADUser" on "SyncRS_ADUser"."UserId" = "SyncRS_User"."Id")
;

CREATE TABLE "SyncRS_FavoriteItem" (
	"Id" int PRIMARY KEY NOT NULL,
	"UserId" int NOT NULL,
	"ItemId" NCHAR(36) NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_FavoriteItem_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncRS_FavoriteItem"  ADD FOREIGN KEY("UserId") REFERENCES "SyncRS_User" ("Id")
;
ALTER TABLE "SyncRS_FavoriteItem"  ADD FOREIGN KEY("ItemId") REFERENCES "SyncRS_Item" ("Id")
;

CREATE TABLE "SyncRS_AzureADCredential"(
	"Id" int primary key NOT NULL,
	"TenantName" NVARCHAR2(255),
	"ClientId" NVARCHAR2(100),
	"ClientSecret" NVARCHAR2(100),
	"IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_AzureADCredential_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

CREATE TABLE "SyncRS_AzureADUser"(
	"Id" int primary key NOT NULL,
	"UserId" int NOT NULL,
	"AzureADUserId" NCHAR(36) NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_AzureADUser_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncRS_AzureADUser" ADD FOREIGN KEY("UserId") REFERENCES "SyncRS_User" ("Id")
;

CREATE TABLE "SyncRS_AzureADGroup"(
	"Id" int primary key NOT NULL,
	"GroupId" int NOT NULL,
	"AzureADGroupId" NCHAR(36) NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_AzureADGroup_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncRS_AzureADGroup" ADD FOREIGN KEY("GroupId") REFERENCES "SyncRS_Group" ("Id")
;


CREATE TABLE "SyncRS_SAMLSettings"(
	"Id" int primary key NOT NULL, 
	"MetadataURI" VARCHAR2(4000), 
	"IsEnabled" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_SAMLSettings_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

CREATE TABLE "SyncRS_UserType"(
	"Id" int primary key NOT NULL, 
	"Type" NVARCHAR2(100))
;

CREATE SEQUENCE "SyncRS_UserType_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

INSERT into "SyncRS_UserType" ("Id","Type") values("SyncRS_UserType_seq".nextval,'Server User')
;
INSERT into "SyncRS_UserType" ("Id","Type") values("SyncRS_UserType_seq".nextval,'Active Directory User')
;
INSERT into "SyncRS_UserType" ("Id","Type") values("SyncRS_UserType_seq".nextval,'Federation User')
;
INSERT into "SyncRS_ItemCommentLogType" ("Id","Name","IsActive") VALUES ("SyncRS_ItemCommentLogType_seq".nextval,'UserMention',1)
;

CREATE TABLE "SyncRS_ItemView"(
	"Id" int PRIMARY KEY NOT NULL,
	"ItemId" NCHAR(36) NOT NULL,
	"UserId" int NOT NULL,
	"ItemViewId" NCHAR(36) NOT NULL,
	"QueryString" VARCHAR2(4000) NOT NULL,
	"ModifiedDate" DATE NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_ItemView_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncRS_ItemView"  ADD FOREIGN KEY("ItemId") REFERENCES "SyncRS_Item" ("Id")
;
ALTER TABLE "SyncRS_ItemView"  ADD FOREIGN KEY("ItemViewId") REFERENCES "SyncRS_Item" ("Id")
;
ALTER TABLE "SyncRS_ItemView"  ADD FOREIGN KEY("UserId") REFERENCES "SyncRS_User" ("Id")
;

INSERT into "SyncRS_PermissionEntity" ("Id","Name","EntityType","IsActive") VALUES ("SyncRS_PermissionEntity_seq".nextval,'Specific ItemView',0, 1)
;
