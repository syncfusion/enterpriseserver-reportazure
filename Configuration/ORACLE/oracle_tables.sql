CREATE TABLE "SyncRS_User"(
	"Id" int primary key NOT NULL,
	"UserName" NVARCHAR2(100) NOT NULL,
	"FirstName" NVARCHAR2(255) NOT NULL,
	"LastName" NVARCHAR2(255) NULL,
	"DisplayName" NVARCHAR2(512) NULL,
	"Email" NVARCHAR2(255) NOT NULL,
	"Password" NVARCHAR2(255) NOT NULL,
	"Contact" NVARCHAR2(20) NULL,
	"Picture" NVARCHAR2(100) NOT NULL,	
	"CreatedDate" DATE NOT NULL,
	"ModifiedDate" DATE NULL,
	"LastLogin" DATE NULL,
	"PasswordChangedDate" DATE NULL,
	"ActivationExpirationDate" DATE NULL,
	"ActivationCode" NVARCHAR2(255) NOT NULL,
	"ResetPasswordCode" NVARCHAR2(255) NULL,
	"LastResetAttempt" DATE NULL,
	"UserTypeId" int DEFAULT 0 NOT NULL,
	"IsActivated" NUMBER(1) NOT NULL,
	"IsActive" NUMBER(1) NOT NULL,
	"IsDeleted" NUMBER(1) NOT NULL,
	"DomainId" VARCHAR2(4000) NULL)
;

CREATE SEQUENCE "SyncRS_User_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

CREATE TABLE "SyncRS_Group"(
	"Id" int PRIMARY KEY NOT NULL,
	"Name" NVARCHAR2(255) NOT NULL,
	"Description" NVARCHAR2(1026) NULL,
	"Color" NVARCHAR2(255) DEFAULT 'White' NOT NULL,
	"ModifiedDate" DATE NOT NULL,
	"IsActive" NUMBER(1) NOT NULL,
	"DomainId" VARCHAR2(4000) NULL)
;

CREATE SEQUENCE "SyncRS_Group_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

CREATE TABLE "SyncRS_UserGroup"(
	"Id" int PRIMARY KEY NOT NULL,
	"GroupId" int NOT NULL,
	"UserId" int NOT NULL,
	"ModifiedDate" DATE NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_UserGroup_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncRS_UserGroup"  ADD FOREIGN KEY("GroupId") REFERENCES "SyncRS_Group" ("Id")
;
ALTER TABLE "SyncRS_UserGroup"  ADD FOREIGN KEY("UserId") REFERENCES "SyncRS_User" ("Id")
;

CREATE TABLE "SyncRS_UserLogType"(
	"Id" int primary key NOT NULL,
	"Name" NVARCHAR2(100) NOT NULL UNIQUE,
	"IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_UserLogType_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

CREATE TABLE "SyncRS_UserLog"(
	"Id" int primary key NOT NULL,
	"UserLogTypeId" int NOT NULL,	
	"GroupId" int NULL,
	"OldValue" int NULL,
	"NewValue" int NULL,
	"UpdatedUserId" int NOT NULL,
	"TargetUserId" int NOT NULL,
	"ModifiedDate" DATE NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_UserLog_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncRS_UserLog"  ADD  FOREIGN KEY("UserLogTypeId") REFERENCES "SyncRS_UserLogType" ("Id")
;
ALTER TABLE "SyncRS_UserLog"  ADD  FOREIGN KEY("GroupId") REFERENCES "SyncRS_Group" ("Id")
;
ALTER TABLE "SyncRS_UserLog"  ADD  FOREIGN KEY("TargetUserId") REFERENCES "SyncRS_User" ("Id")
;
ALTER TABLE "SyncRS_UserLog"  ADD  FOREIGN KEY("UpdatedUserId") REFERENCES "SyncRS_User" ("Id")
;

CREATE TABLE "SyncRS_UserLogin"(
	"Id" int PRIMARY KEY NOT NULL,
	"UserId" int NOT NULL,
	"ClientToken" VARCHAR2(4000) NOT NULL,
	"IpAddress" NVARCHAR2(50) NOT NULL,
	"LoggedInTime" DATE NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_UserLogin_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncRS_UserLogin"  ADD FOREIGN KEY("UserId") REFERENCES "SyncRS_User" ("Id")
;

CREATE TABLE "SyncRS_UserPreference"(
	"Id" int PRIMARY KEY NOT NULL,
	"UserId" int NOT NULL,
	"Language" VARCHAR2(4000) NULL,
	"TimeZone" NVARCHAR2(100) NULL,
	"RecordSize" int NULL,
	"ItemSort" VARCHAR2(4000) NULL,
	"ItemFilters" VARCHAR2(4000) NULL,
	"Notifications" VARCHAR2(4000) NULL,
	"ModifiedDate" DATE NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_UserPreference_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncRS_UserPreference" ADD FOREIGN KEY("UserId") REFERENCES "SyncRS_User" ("Id")
;

CREATE TABLE "SyncRS_SystemLogType"(
	"Id" int primary key NOT NULL,
	"Name" NVARCHAR2(100) NOT NULL UNIQUE,
	"IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_SystemLogType_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

CREATE TABLE "SyncRS_SystemLog"(
	"LogId" int primary key NOT NULL,
	"SystemLogTypeId" int NOT NULL,
	"UpdatedUserId" int NOT NULL,
	"TargetUserId" int NOT NULL,		
	"ModifiedDate" DATE NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_SystemLog_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncRS_SystemLog"  ADD FOREIGN KEY("SystemLogTypeId") REFERENCES "SyncRS_SystemLogType" ("Id")
;
ALTER TABLE "SyncRS_SystemLog"  ADD FOREIGN KEY("UpdatedUserId") REFERENCES "SyncRS_User" ("Id")
;
ALTER TABLE "SyncRS_SystemLog"  ADD FOREIGN KEY("TargetUserId") REFERENCES "SyncRS_User" ("Id")
;

CREATE TABLE "SyncRS_ItemType"(
	"Id" int PRIMARY KEY NOT NULL,
	"Name" NVARCHAR2(100) NOT NULL UNIQUE,
	"IsActive" NUMBER(1) NULL)
;

CREATE SEQUENCE "SyncRS_ItemType_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

CREATE TABLE "SyncRS_Item"(
	"Id" NCHAR(36) PRIMARY KEY NOT NULL,
	"Name" NVARCHAR2(255) NOT NULL,
	"Description" NVARCHAR2(1026) NULL,
	"ItemTypeId" int NOT NULL,
	"ParentId" NCHAR(36) NULL,
	"Extension" NVARCHAR2(30) NULL,
	"CloneItemId" NCHAR(36) NULL,
	"CreatedById" int NOT NULL,
	"ModifiedById" int NOT NULL,
	"CreatedDate" DATE NOT NULL,
	"ModifiedDate" DATE NOT NULL,
	"IsPublic" NUMBER(1) DEFAULT (0) NOT NULL,
	"IsActive" NUMBER(1) NULL,
	"IsWebDesignerCompatible" NUMBER(1) DEFAULT (0) NOT NULL)
;
CREATE SEQUENCE "SyncRS_Item_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;


ALTER TABLE "SyncRS_Item"  ADD FOREIGN KEY("ItemTypeId") REFERENCES "SyncRS_ItemType" ("Id")
;
ALTER TABLE "SyncRS_Item"  ADD FOREIGN KEY("ParentId") REFERENCES "SyncRS_Item" ("Id")
;
ALTER TABLE "SyncRS_Item"  ADD FOREIGN KEY("CreatedById") REFERENCES "SyncRS_User" ("Id")
;
ALTER TABLE "SyncRS_Item"  ADD FOREIGN KEY("ModifiedById") REFERENCES "SyncRS_User" ("Id")
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

CREATE TABLE "SyncRS_ItemLogType"(
	"Id" int PRIMARY KEY NOT NULL,
	"Name" NVARCHAR2(100) NULL UNIQUE,
	"IsActive" NUMBER(1) NULL)
;

CREATE SEQUENCE "SyncRS_ItemLogType_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;


CREATE TABLE "SyncRS_ItemTrash"(
	"Id" int PRIMARY KEY NOT NULL,
	"ItemId" NCHAR(36) NOT NULL,
	"TrashedById" int NOT NULL,
	"TrashedDate" DATE NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_ItemTrash_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncRS_ItemTrash"  ADD FOREIGN KEY("ItemId") REFERENCES "SyncRS_Item" ("Id")
;
ALTER TABLE "SyncRS_ItemTrash"  ADD FOREIGN KEY("TrashedById") REFERENCES "SyncRS_User" ("Id")
;

CREATE TABLE "SyncRS_ItemTrashDeleted"(
	"Id" int PRIMARY KEY NOT NULL,
	"ItemId" NCHAR(36) NOT NULL,
	"ItemTrashId" int NOT NULL,
	"DeletedById" int NOT NULL,
	"DeletedDate" DATE NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_ItemTrashDeleted_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncRS_ItemTrashDeleted"  ADD FOREIGN KEY("ItemId") REFERENCES "SyncRS_Item" ("Id")
;
ALTER TABLE "SyncRS_ItemTrashDeleted"  ADD FOREIGN KEY("ItemTrashId") REFERENCES "SyncRS_ItemTrash" ("Id")
;
ALTER TABLE "SyncRS_ItemTrashDeleted"  ADD FOREIGN KEY("DeletedById") REFERENCES "SyncRS_User" ("Id")
;

CREATE TABLE "SyncRS_ItemVersion"(
	"Id" int PRIMARY KEY NOT NULL,
	"ItemId" NCHAR(36) NOT NULL,
	"ItemTypeId" int NOT NULL,
	"ItemName" NVARCHAR2(265) NULL,
	"VersionNumber" int NOT NULL,
	"RolledbackVersionNumber" int NULL,
	"Comment" NVARCHAR2(1026) NULL,
	"IsCurrentVersion" NUMBER(1) NOT NULL,
	"CreatedById" int NOT NULL,
	"CreatedDate" DATE NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_ItemVersion_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncRS_ItemVersion"  ADD FOREIGN KEY("ItemTypeId") REFERENCES "SyncRS_ItemType" ("Id")
;
ALTER TABLE "SyncRS_ItemVersion"  ADD FOREIGN KEY("ItemId") REFERENCES "SyncRS_Item" ("Id")
;
ALTER TABLE "SyncRS_ItemVersion"  ADD FOREIGN KEY("CreatedById") REFERENCES "SyncRS_User" ("Id")
;

CREATE TABLE "SyncRS_ItemLog"(
	"Id" int PRIMARY KEY NOT NULL,
	"ItemLogTypeId" int NOT NULL,
	"ItemId" NCHAR(36) NOT NULL,
	"ItemVersionId" int NOT NULL,
	"ParentId" NCHAR(36) NULL,
	"FromCategoryId" NCHAR(36) NULL,
	"ToCategoryId" NCHAR(36) NULL,
	"UpdatedUserId" int NOT NULL,	
	"ModifiedDate" DATE NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_ItemLog_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncRS_ItemLog"  ADD FOREIGN KEY("ItemVersionId") REFERENCES "SyncRS_ItemVersion" ("Id")
;
ALTER TABLE "SyncRS_ItemLog"  ADD FOREIGN KEY("ItemLogTypeId") REFERENCES "SyncRS_ItemLogType" ("Id")
;
ALTER TABLE "SyncRS_ItemLog"  ADD FOREIGN KEY("ItemId") REFERENCES "SyncRS_Item" ("Id")
;
ALTER TABLE "SyncRS_ItemLog"  ADD FOREIGN KEY("ParentId") REFERENCES "SyncRS_Item" ("Id")
;
ALTER TABLE "SyncRS_ItemLog"  ADD FOREIGN KEY("FromCategoryId") REFERENCES "SyncRS_Item" ("Id")
;
ALTER TABLE "SyncRS_ItemLog"  ADD FOREIGN KEY("ToCategoryId") REFERENCES "SyncRS_Item" ("Id")
;
ALTER TABLE "SyncRS_ItemLog"  ADD FOREIGN KEY("UpdatedUserId") REFERENCES "SyncRS_User" ("Id")
;


CREATE TABLE "SyncRS_PermissionEntity"(
	"Id" int PRIMARY KEY NOT NULL,
	"Name" NVARCHAR2(100) NOT NULL UNIQUE,
	"EntityType" int NOT NULL,
	"ItemTypeId" int NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
;
ALTER TABLE "SyncRS_PermissionEntity"  ADD FOREIGN KEY("ItemTypeId") REFERENCES "SyncRS_ItemType" ("Id")
;


CREATE SEQUENCE "SyncRS_PermissionEntity_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

CREATE TABLE "SyncRS_UserPermission"(
	"Id" int PRIMARY KEY NOT NULL,
	"PermissionAccessId" int NOT NULL,
	"PermissionEntityId" int NOT NULL,
	"ItemId" NCHAR(36) NULL,
	"UserId" int NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_UserPermission_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncRS_UserPermission"  ADD  FOREIGN KEY("PermissionEntityId") REFERENCES "SyncRS_PermissionEntity" ("Id")
;
ALTER TABLE "SyncRS_UserPermission"  ADD  FOREIGN KEY("ItemId") REFERENCES "SyncRS_Item" ("Id")
;
ALTER TABLE "SyncRS_UserPermission" ADD  FOREIGN KEY("UserId") REFERENCES "SyncRS_User" ("Id")
;

CREATE TABLE "SyncRS_GroupPermission"(
	"Id" int PRIMARY KEY NOT NULL,
	"PermissionAccessId" int NOT NULL,
	"PermissionEntityId" int NOT NULL,
	"ItemId" NCHAR(36) NULL,
	"GroupId" int NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_GroupPermission_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncRS_GroupPermission"  ADD  FOREIGN KEY("PermissionEntityId") REFERENCES "SyncRS_PermissionEntity" ("Id")
;
ALTER TABLE "SyncRS_GroupPermission"  ADD  FOREIGN KEY("ItemId") REFERENCES "SyncRS_Item" ("Id")
;
ALTER TABLE "SyncRS_GroupPermission"  ADD  FOREIGN KEY("GroupId") REFERENCES "SyncRS_Group" ("Id")
;

CREATE TABLE "SyncRS_RecurrenceType"(
	"Id" int PRIMARY KEY NOT NULL,
	"Name" NVARCHAR2(30) NOT NULL UNIQUE,
	"IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_RecurrenceType_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

CREATE TABLE "SyncRS_ExportType"(
	"Id" int PRIMARY KEY NOT NULL,
	"Name" NVARCHAR2(20) NOT NULL UNIQUE,
	"IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_ExportType_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

CREATE TABLE "SyncRS_ScheduleDetail"(
	"Id" int PRIMARY KEY NOT NULL,
	"ScheduleId" NCHAR(36) NOT NULL,
	"ItemId" NCHAR(36) NOT NULL,
	"Name" NVARCHAR2(150) NOT NULL,
	"RecurrenceTypeId" int NOT NULL,
	"RecurrenceInfo" VARCHAR2(4000) NOT NULL,
	"ExportFileSettingsInfo" VARCHAR2(4000) NULL,
	"StartDate" DATE NOT NULL,
	"EndDate" DATE NULL,
	"EndAfter" int DEFAULT 0 NOT NULL,
	"NextSchedule" DATE,
	"ExportTypeId" int NOT NULL,
	"IsEnabled" NUMBER(1) NOT NULL,
	"IsParameterEnabled" NUMBER(1) NOT NULL,
	"IsSaveAsFile" NUMBER(1) NOT NULL,
    "IsSendAsMail" NUMBER(1) DEFAULT 1 NOT NULL,
    "ReportCount" int DEFAULT 0 NOT NULL,
    "ExportPath" VARCHAR2(4000) NULL,
	"CreatedById" int NOT NULL,
	"ModifiedById" int NOT NULL,
	"CreatedDate" DATE NOT NULL,
	"ModifiedDate" DATE NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_ScheduleDetail_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncRS_ScheduleDetail"  ADD FOREIGN KEY("ScheduleId") REFERENCES "SyncRS_Item" ("Id")
;
ALTER TABLE "SyncRS_ScheduleDetail"  ADD FOREIGN KEY("ItemId") REFERENCES "SyncRS_Item" ("Id")
;
ALTER TABLE "SyncRS_ScheduleDetail"  ADD FOREIGN KEY("RecurrenceTypeId") REFERENCES "SyncRS_RecurrenceType" ("Id")
;
ALTER TABLE "SyncRS_ScheduleDetail"  ADD FOREIGN KEY("ExportTypeId") REFERENCES "SyncRS_ExportType" ("Id")
;
ALTER TABLE "SyncRS_ScheduleDetail"  ADD FOREIGN KEY("CreatedById") REFERENCES "SyncRS_User" ("Id")
;
ALTER TABLE "SyncRS_ScheduleDetail"  ADD FOREIGN KEY("ModifiedById") REFERENCES "SyncRS_User" ("Id")
;

CREATE TABLE "SyncRS_SubscribedUser"(
	"Id" int PRIMARY KEY NOT NULL,
	"ScheduleId" NCHAR(36) NOT NULL,
	"SubscribedById" int NOT NULL,
	"RecipientUserId" int NOT NULL,
	"SubscribedDate" DATE NOT NULL,
	"ModifiedDate" DATE NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_SubscribedUser_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncRS_SubscribedUser"  ADD FOREIGN KEY("ScheduleId") REFERENCES "SyncRS_Item" ("Id")
;
ALTER TABLE "SyncRS_SubscribedUser"  ADD FOREIGN KEY("SubscribedById") REFERENCES "SyncRS_User" ("Id")
;
ALTER TABLE "SyncRS_SubscribedUser"  ADD FOREIGN KEY("RecipientUserId") REFERENCES "SyncRS_User" ("Id")
;

CREATE TABLE "SyncRS_SubscribedGroup"(
	"Id" int PRIMARY KEY NOT NULL,
	"ScheduleId" NCHAR(36) NOT NULL,
	"SubscribedById" int NOT NULL,
	"RecipientGroupId" int NOT NULL,
	"SubscribedDate" DATE NOT NULL,
	"ModifiedDate" DATE NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_SubscribedGroup_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncRS_SubscribedGroup"  ADD FOREIGN KEY("ScheduleId") REFERENCES "SyncRS_Item" ("Id")
;
ALTER TABLE "SyncRS_SubscribedGroup"  ADD FOREIGN KEY("SubscribedById") REFERENCES "SyncRS_User" ("Id")
;
ALTER TABLE "SyncRS_SubscribedGroup"  ADD FOREIGN KEY("RecipientGroupId") REFERENCES "SyncRS_Group" ("Id")
;

CREATE TABLE "SyncRS_SubscrExtnRecpt"(
	"Id" int PRIMARY KEY NOT NULL,
	"ScheduleId" NCHAR(36) NOT NULL,
	"SubscribedById" int NOT NULL,
	"EmailIds" VARCHAR2(4000) NOT NULL,
	"SubscribedDate" DATE NOT NULL,
	"ModifiedDate" DATE NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_SubscrExtnRecpt_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;
	
ALTER TABLE "SyncRS_SubscrExtnRecpt"  ADD FOREIGN KEY("ScheduleId") REFERENCES "SyncRS_Item" ("Id")
;
ALTER TABLE "SyncRS_SubscrExtnRecpt"  ADD FOREIGN KEY("SubscribedById") REFERENCES "SyncRS_User" ("Id")
;

CREATE TABLE "SyncRS_ScheduleStatus"(
	"Id" int PRIMARY KEY NOT NULL,
	"Name" NVARCHAR2(100) NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_ScheduleStatus_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

CREATE TABLE "SyncRS_ScheduleLogUser"(
	"Id" int PRIMARY KEY NOT NULL,
	"ScheduleId" NCHAR(36) NOT NULL,
	"ScheduleStatusId" int NOT NULL,
	"DeliveredUserId" int NOT NULL,
	"DeliveredDate" DATE NOT NULL,
	"IsOnDemand" NUMBER(1) NOT NULL,	
	"IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_ScheduleLogUser_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncRS_ScheduleLogUser"  ADD FOREIGN KEY("ScheduleStatusId") REFERENCES "SyncRS_ScheduleStatus" ("Id")
;
ALTER TABLE "SyncRS_ScheduleLogUser"  ADD FOREIGN KEY("ScheduleId") REFERENCES "SyncRS_Item" ("Id")
;
ALTER TABLE "SyncRS_ScheduleLogUser"  ADD FOREIGN KEY("DeliveredUserId") REFERENCES "SyncRS_User" ("Id")
;

CREATE TABLE "SyncRS_ScheduleLogGroup"(
	"Id" int PRIMARY KEY NOT NULL,
	"ScheduleId" NCHAR(36) NOT NULL,
	"ScheduleStatusId" int NOT NULL,
	"GroupId" int NOT NULL,
	"DeliveredUserId" int NOT NULL,
	"DeliveredDate" DATE NOT NULL,
	"IsOnDemand" NUMBER(1) NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_ScheduleLogGroup_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncRS_ScheduleLogGroup"  ADD FOREIGN KEY("ScheduleStatusId") REFERENCES "SyncRS_ScheduleStatus" ("Id")
;
ALTER TABLE "SyncRS_ScheduleLogGroup"  ADD FOREIGN KEY("ScheduleId") REFERENCES "SyncRS_Item" ("Id")
;
ALTER TABLE "SyncRS_ScheduleLogGroup"  ADD FOREIGN KEY("GroupId") REFERENCES "SyncRS_Group" ("Id")
;
ALTER TABLE "SyncRS_ScheduleLogGroup"  ADD FOREIGN KEY("DeliveredUserId") REFERENCES "SyncRS_User" ("Id")
;

CREATE TABLE "SyncRS_SchdLogExtnRecpt"(
	"Id" int PRIMARY KEY NOT NULL,
	"ScheduleId" NCHAR(36) NOT NULL,
	"ScheduleStatusId" int NOT NULL,
	"DeliveredEmailId" NVARCHAR2(150) NOT NULL,
	"DeliveredDate" DATE NOT NULL,
	"IsOnDemand" NUMBER(1) NOT NULL,	
	"IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_SchdLogExtnRecpt_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;
	
ALTER TABLE "SyncRS_SchdLogExtnRecpt"  ADD FOREIGN KEY("ScheduleStatusId") REFERENCES "SyncRS_ScheduleStatus" ("Id")
;
ALTER TABLE "SyncRS_SchdLogExtnRecpt"  ADD FOREIGN KEY("ScheduleId") REFERENCES "SyncRS_Item" ("Id")
;

CREATE TABLE "SyncRS_ReportDataSource"(
	"Id" int PRIMARY KEY NOT NULL,
	"ReportItemId" NCHAR(36) NOT NULL,
	"DataSourceItemId" NCHAR(36) NOT NULL,
	"Name" NVARCHAR2(255) NOT NULL,
	"ModifiedDate" DATE NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_ReportDataSource_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncRS_ReportDataSource"  ADD FOREIGN KEY("ReportItemId") REFERENCES "SyncRS_Item" ("Id")
;
ALTER TABLE "SyncRS_ReportDataSource"  ADD FOREIGN KEY("DataSourceItemId") REFERENCES "SyncRS_Item" ("Id")
;

CREATE TABLE "SyncRS_ScheduleLog"(
	"Id" int PRIMARY KEY NOT NULL,
	"ScheduleStatusId" int NOT NULL,
	"ScheduleId" NCHAR(36) NOT NULL,
	"ExecutedDate" DATE NOT NULL,
	"ModifiedDate" DATE NOT NULL,
	"IsOnDemand" NUMBER(1) DEFAULT (0) NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_ScheduleLog_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncRS_ScheduleLog"  ADD FOREIGN KEY("ScheduleStatusId") REFERENCES "SyncRS_ScheduleStatus" ("Id")
;
ALTER TABLE "SyncRS_ScheduleLog"  ADD FOREIGN KEY("ScheduleId") REFERENCES "SyncRS_Item" ("Id")
;

CREATE TABLE "SyncRS_SystemSettings"(
	"Id" int PRIMARY KEY NOT NULL,
	"Key" NVARCHAR2(255) NOT NULL,
	"Value" VARCHAR2(4000) NULL,
	"ModifiedDate" DATE NOT NULL,
	"IsActive" NUMBER(1) NOT NULL,
	CONSTRAINT UK_SyncRS_SystemSettings_Key UNIQUE ("Key"))
;

CREATE SEQUENCE "SyncRS_SystemSettings_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

CREATE TABLE "SyncRS_DataSourceDetail"(
	"Id" int PRIMARY KEY NOT NULL,
	"DataSourceId" NCHAR(36) NOT NULL,
	"Password" NVARCHAR2(255) NOT NULL,
	"ModifiedDate" DATE NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_DataSourceDetail_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncRS_DataSourceDetail" ADD FOREIGN KEY("DataSourceId") REFERENCES "SyncRS_Item" ("Id")
;

CREATE TABLE "SyncRS_ServerVersion"(
	"Id" int PRIMARY KEY NOT NULL,
	"VersionNumber" NVARCHAR2(20) NOT NULL)
;
CREATE SEQUENCE "SyncRS_ServerVersion_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

create table "SyncRS_ADUser"(
	"Id" int primary key NOT NULL,
	"UserId" int not null,
	"ActiveDirectoryUserId" NCHAR(36) not null,
	"IsActive" NUMBER(1) not null)
;

CREATE SEQUENCE "SyncRS_ADUser_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncRS_ADUser" ADD FOREIGN KEY("UserId") REFERENCES "SyncRS_User" ("Id")
;

create table "SyncRS_ADGroup"(
	"Id" int primary key NOT NULL,
	"GroupId" int not null,
	"ActiveDirectoryGroupId" NCHAR(36) not null,
	"IsActive" NUMBER(1) not null)
;

CREATE SEQUENCE "SyncRS_ADGroup_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncRS_ADGroup" ADD FOREIGN KEY("GroupId") REFERENCES "SyncRS_Group" ("Id")
;

create table "SyncRS_ADCredential"(
	"Id" int primary key NOT NULL,
	"Username" NVARCHAR2(100),
	"Password" NVARCHAR2(100),
	"LdapUrl" NVARCHAR2(255),
	"EnableSsl" NUMBER(1) not null,
	"DistinguishedName" NVARCHAR2(150),
	"PortNo" int not null,
	"IsActive" NUMBER(1) not null)
;

CREATE SEQUENCE "SyncRS_ADCredential_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

CREATE TABLE "SyncRS_Comment"(
    "Id" int primary key NOT NULL,
    "Comment" VARCHAR2(4000) NOT NULL,
    "ItemId" NCHAR(36) NOT NULL,
    "UserId" int NOT NULL,
    "ParentId" int NULL,
    "CreatedDate" DATE NOT NULL,
    "ModifiedDate" DATE NOT NULL,
    "ModifiedById" int NOT NULL,
    "IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_Comment_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncRS_Comment" ADD FOREIGN KEY("ItemId") REFERENCES "SyncRS_Item" ("Id")
;
ALTER TABLE "SyncRS_Comment" ADD FOREIGN KEY("UserId") REFERENCES "SyncRS_User" ("Id")
;
ALTER TABLE "SyncRS_Comment" ADD FOREIGN KEY("ModifiedById") REFERENCES "SyncRS_User" ("Id")
; 

CREATE TABLE "SyncRS_ItemWatch"(
            "Id" int PRIMARY KEY NOT NULL,
            "ItemId" NCHAR(36) NOT NULL,
            "UserId" int NOT NULL,
            "ModifiedDate" DATE NOT NULL,
			"IsWatched" NUMBER(1) NOT NULL,
            "IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_ItemWatch_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;
 
ALTER TABLE "SyncRS_ItemWatch" ADD FOREIGN KEY("ItemId") REFERENCES "SyncRS_Item" ("Id")
;
ALTER TABLE "SyncRS_ItemWatch" ADD FOREIGN KEY("UserId") REFERENCES "SyncRS_User" ("Id")
; 

CREATE TABLE "SyncRS_ItemCommentLogType"(
    "Id" int PRIMARY KEY NOT NULL,
    "Name" NVARCHAR2(100) NULL UNIQUE,
    "IsActive" NUMBER(1) NULL)
;

CREATE SEQUENCE "SyncRS_ItemCommentLogType_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

CREATE TABLE "SyncRS_ItemCommentLog"(
    "Id" int PRIMARY KEY NOT NULL,
    "ItemCommentLogTypeId" int NOT NULL,
    "CurrentUserId" int NOT NULL,    
    "CommentId" int NOT NULL,
	"Url" VARCHAR2(4000) NOT NULL,
    "ClubId" NVARCHAR2(100) NOT NULL,
    "RepliedFor" int NULL,
    "OldValue" VARCHAR2(4000) NULL,
    "NewValue" VARCHAR2(4000) NULL,
    "NotificationTo" int NULL,    
    "ModifiedDate" DATE NOT NULL,
    "IsRead" NUMBER(1) NOT NULL,
    "IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_ItemCommentLog_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncRS_ItemCommentLog"  ADD FOREIGN KEY("CurrentUserId") REFERENCES "SyncRS_User" ("Id")
;
ALTER TABLE "SyncRS_ItemCommentLog"  ADD FOREIGN KEY("ItemCommentLogTypeId") REFERENCES "SyncRS_ItemCommentLogType" ("Id")
;
ALTER TABLE "SyncRS_ItemCommentLog"  ADD FOREIGN KEY("CommentId") REFERENCES "SyncRS_Comment" ("Id")
;
ALTER TABLE "SyncRS_ItemCommentLog"  ADD FOREIGN KEY("RepliedFor") REFERENCES "SyncRS_Comment" ("Id")
;
ALTER TABLE "SyncRS_ItemCommentLog"  ADD FOREIGN KEY("NotificationTo") REFERENCES "SyncRS_User" ("Id")
;

CREATE TABLE "SyncRS_DatasetLinkage"(
	"Id" int PRIMARY KEY NOT NULL,
	"DatasetItemId" NCHAR(36) NOT NULL,
	"ItemId" NCHAR(36) NOT NULL,
	"Name" NVARCHAR2(255) NOT NULL,
	"ModifiedDate" DATE NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_DatasetLinkage_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncRS_DatasetLinkage"  ADD FOREIGN KEY("DatasetItemId") REFERENCES "SyncRS_Item" ("Id")
;
ALTER TABLE "SyncRS_DatasetLinkage"  ADD FOREIGN KEY("ItemId") REFERENCES "SyncRS_Item" ("Id")
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
	"Authority" VARCHAR2(4000),
	"DesignerClientId" VARCHAR2(100),
	"TenantName" VARCHAR2(100),
	"MobileAppId" VARCHAR2(100),	
	"IsEnabled" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_SAMLSettings_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

CREATE TABLE "SyncRS_UserType"(
	"Id" int primary key NOT NULL, 
	"Type" NVARCHAR2(100) UNIQUE)
;

CREATE SEQUENCE "SyncRS_UserType_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

INSERT into "SyncRS_ItemType" ("Id","Name","IsActive") VALUES ("SyncRS_ItemType_seq".nextval,'Category',1)
;
INSERT into "SyncRS_ItemType" ("Id","Name","IsActive") VALUES ("SyncRS_ItemType_seq".nextval,'Dashboard',1)
;
INSERT into "SyncRS_ItemType" ("Id","Name","IsActive") VALUES ("SyncRS_ItemType_seq".nextval,'Report',1)
;
INSERT into "SyncRS_ItemType" ("Id","Name","IsActive") VALUES ("SyncRS_ItemType_seq".nextval,'Datasource',1)
;
INSERT into "SyncRS_ItemType" ("Id","Name","IsActive") VALUES ("SyncRS_ItemType_seq".nextval,'Dataset',1)
;
INSERT into "SyncRS_ItemType" ("Id","Name","IsActive") VALUES ("SyncRS_ItemType_seq".nextval,'File',1)
;
INSERT into "SyncRS_ItemType" ("Id","Name","IsActive") VALUES ("SyncRS_ItemType_seq".nextval,'Schedule',1)
;
INSERT into "SyncRS_ItemType" ("Id","Name","IsActive") VALUES ("SyncRS_ItemType_seq".nextval,'Widget',1)
;
INSERT into "SyncRS_ItemType" ("Id","Name","IsActive") VALUES ("SyncRS_ItemType_seq".nextval,'ItemView',1)
;
INSERT into "SyncRS_ItemLogType" ("Id","Name","IsActive") VALUES ("SyncRS_ItemLogType_seq".nextval,'Added',1)
;
INSERT into "SyncRS_ItemLogType" ("Id","Name","IsActive") VALUES ("SyncRS_ItemLogType_seq".nextval,'Edited',1)
;
INSERT into "SyncRS_ItemLogType" ("Id","Name","IsActive") VALUES ("SyncRS_ItemLogType_seq".nextval,'Deleted',1)
;
INSERT into "SyncRS_ItemLogType" ("Id","Name","IsActive") VALUES ("SyncRS_ItemLogType_seq".nextval,'Moved',1)
;
INSERT into "SyncRS_ItemLogType" ("Id","Name","IsActive") VALUES ("SyncRS_ItemLogType_seq".nextval,'Copied',1)
;
INSERT into "SyncRS_ItemLogType" ("Id","Name","IsActive") VALUES ("SyncRS_ItemLogType_seq".nextval,'Cloned',1)
;
INSERT into "SyncRS_ItemLogType" ("Id","Name","IsActive") VALUES ("SyncRS_ItemLogType_seq".nextval,'Trashed',1)
;
INSERT into "SyncRS_ItemLogType" ("Id","Name","IsActive") VALUES ("SyncRS_ItemLogType_seq".nextval,'Restored',1)
;
INSERT into "SyncRS_ItemLogType" ("Id","Name","IsActive") VALUES ("SyncRS_ItemLogType_seq".nextval,'Rollbacked',1)
;

INSERT into "SyncRS_SystemLogType" ("Id","Name","IsActive") VALUES ("SyncRS_SystemLogType_seq".nextval,'Updated',1)
;

INSERT into "SyncRS_UserLogType" ("Id","Name","IsActive") VALUES ("SyncRS_UserLogType_seq".nextval,'Added',1)
;
INSERT into "SyncRS_UserLogType" ("Id","Name","IsActive") VALUES ("SyncRS_UserLogType_seq".nextval,'Updated',1)
;
INSERT into "SyncRS_UserLogType" ("Id","Name","IsActive") VALUES ("SyncRS_UserLogType_seq".nextval,'Deleted',1)
;
INSERT into "SyncRS_UserLogType" ("Id","Name","IsActive") VALUES ("SyncRS_UserLogType_seq".nextval,'Changed',1)
;

INSERT into "SyncRS_ExportType" ("Id","Name","IsActive") VALUES ("SyncRS_ExportType_seq".nextval,'Excel', 1)
;
INSERT into "SyncRS_ExportType" ("Id","Name","IsActive") VALUES ("SyncRS_ExportType_seq".nextval,'HTML', 1)
;
INSERT into "SyncRS_ExportType" ("Id","Name","IsActive") VALUES ("SyncRS_ExportType_seq".nextval,'PDF', 1)
;
INSERT into "SyncRS_ExportType" ("Id","Name","IsActive") VALUES ("SyncRS_ExportType_seq".nextval,'Word', 1)
;
INSERT into "SyncRS_ExportType" ("Id","Name","IsActive") VALUES ("SyncRS_ExportType_seq".nextval,'Image', 1)
;
INSERT into "SyncRS_ExportType" ("Id","Name","IsActive") VALUES ("SyncRS_ExportType_seq".nextval,'PPT', 1)
;
INSERT into "SyncRS_ExportType" ("Id","Name","IsActive") VALUES ("SyncRS_ExportType_seq".nextval,'CSV', 1)
;
INSERT into "SyncRS_RecurrenceType" ("Id","Name","IsActive") VALUES ("SyncRS_RecurrenceType_seq".nextval,'Daily', 1)
;
INSERT into "SyncRS_RecurrenceType" ("Id","Name","IsActive") VALUES ("SyncRS_RecurrenceType_seq".nextval,'DailyWeekDay', 1)
;
INSERT into "SyncRS_RecurrenceType" ("Id","Name","IsActive") VALUES ("SyncRS_RecurrenceType_seq".nextval,'Weekly', 1)
;
INSERT into "SyncRS_RecurrenceType" ("Id","Name","IsActive") VALUES ("SyncRS_RecurrenceType_seq".nextval,'Monthly', 1)
;
INSERT into "SyncRS_RecurrenceType" ("Id","Name","IsActive") VALUES ("SyncRS_RecurrenceType_seq".nextval,'MonthlyDOW', 1)
;
INSERT into "SyncRS_RecurrenceType" ("Id","Name","IsActive") VALUES ("SyncRS_RecurrenceType_seq".nextval,'Yearly', 1)
;
INSERT into "SyncRS_RecurrenceType" ("Id","Name","IsActive") VALUES ("SyncRS_RecurrenceType_seq".nextval,'YearlyDOW', 1)
;
INSERT into "SyncRS_RecurrenceType" ("Id","Name","IsActive") VALUES ("SyncRS_RecurrenceType_seq".nextval,'Time', 1)
;
INSERT into "SyncRS_RecurrenceType" ("Id","Name","IsActive") VALUES ("SyncRS_RecurrenceType_seq".nextval,'Hourly',1)
;

INSERT into "SyncRS_ScheduleStatus" ("Id","Name","IsActive") VALUES ("SyncRS_ScheduleStatus_seq".nextval,'Success', 1)
;
INSERT into "SyncRS_ScheduleStatus" ("Id","Name","IsActive") VALUES ("SyncRS_ScheduleStatus_seq".nextval,'Failure', 1)
;

INSERT into "SyncRS_PermissionEntity" ("Id","Name","EntityType","ItemTypeId","IsActive") VALUES ("SyncRS_PermissionEntity_seq".nextval,'All Reports',1,3, 1)
;
INSERT into "SyncRS_PermissionEntity" ("Id","Name","EntityType","ItemTypeId","IsActive") VALUES ("SyncRS_PermissionEntity_seq".nextval,'Reports in Category',2,1, 1)
;
INSERT into "SyncRS_PermissionEntity" ("Id","Name","EntityType","ItemTypeId","IsActive") VALUES ("SyncRS_PermissionEntity_seq".nextval,'Specific Report',0,3, 1)
;
INSERT into "SyncRS_PermissionEntity" ("Id","Name","EntityType","ItemTypeId","IsActive") VALUES ("SyncRS_PermissionEntity_seq".nextval,'All Categories',1,1, 1)
;
INSERT into "SyncRS_PermissionEntity" ("Id","Name","EntityType","ItemTypeId","IsActive") VALUES ("SyncRS_PermissionEntity_seq".nextval,'Specific Category',0,1, 1)
;
INSERT into "SyncRS_PermissionEntity" ("Id","Name","EntityType","ItemTypeId","IsActive") VALUES ("SyncRS_PermissionEntity_seq".nextval,'All Data Sources',1,4, 1)
;
INSERT into "SyncRS_PermissionEntity" ("Id","Name","EntityType","ItemTypeId","IsActive") VALUES ("SyncRS_PermissionEntity_seq".nextval,'Specific Data Source',0,4, 1)
;
INSERT into "SyncRS_PermissionEntity" ("Id","Name","EntityType","ItemTypeId","IsActive") VALUES ("SyncRS_PermissionEntity_seq".nextval,'All Files',1,6, 1)
;
INSERT into "SyncRS_PermissionEntity" ("Id","Name","EntityType","ItemTypeId","IsActive") VALUES ("SyncRS_PermissionEntity_seq".nextval,'Specific File',0,6, 1)
;
INSERT into "SyncRS_PermissionEntity" ("Id","Name","EntityType","ItemTypeId","IsActive") VALUES ("SyncRS_PermissionEntity_seq".nextval,'All Schedules',1,7, 1)
;
INSERT into "SyncRS_PermissionEntity" ("Id","Name","EntityType","ItemTypeId","IsActive") VALUES ("SyncRS_PermissionEntity_seq".nextval,'Specific Schedule',0,7, 1)
;
INSERT into "SyncRS_PermissionEntity" ("Id","Name","EntityType","ItemTypeId","IsActive") VALUES ("SyncRS_PermissionEntity_seq".nextval,'All Dashboards',1,2, 1)
;
INSERT into "SyncRS_PermissionEntity" ("Id","Name","EntityType","ItemTypeId","IsActive") VALUES ("SyncRS_PermissionEntity_seq".nextval,'Dashboards in Category',2,1, 1)
;
INSERT into "SyncRS_PermissionEntity" ("Id","Name","EntityType","ItemTypeId","IsActive") VALUES ("SyncRS_PermissionEntity_seq".nextval,'Specific Dashboard',0,2, 1)
;
INSERT into "SyncRS_PermissionEntity" ("Id","Name","EntityType","ItemTypeId","IsActive") VALUES ("SyncRS_PermissionEntity_seq".nextval,'All Widgets',1,8, 1)
;
INSERT into "SyncRS_PermissionEntity" ("Id","Name","EntityType","ItemTypeId","IsActive") VALUES ("SyncRS_PermissionEntity_seq".nextval,'Specific Widget',0,8, 1)
;
INSERT into "SyncRS_PermissionEntity" ("Id","Name","EntityType","ItemTypeId","IsActive") VALUES ("SyncRS_PermissionEntity_seq".nextval,'All Datasets',1,5, 1)
;
INSERT into "SyncRS_PermissionEntity" ("Id","Name","EntityType","ItemTypeId","IsActive") VALUES ("SyncRS_PermissionEntity_seq".nextval,'Specific Dataset',0,5, 1)
; 
INSERT into "SyncRS_PermissionEntity" ("Id","Name","EntityType","ItemTypeId","IsActive") VALUES ("SyncRS_PermissionEntity_seq".nextval,'Specific ItemView',0,9, 1)
;
INSERT into "SyncRS_PermissionEntity" ("Id","Name","EntityType","ItemTypeId","IsActive") VALUES ("SyncRS_PermissionEntity_seq".nextval,'All ItemViews',1,9, 1)
;
INSERT into "SyncRS_ItemCommentLogType" ("Id","Name","IsActive") VALUES ("SyncRS_ItemCommentLogType_seq".nextval,'Added',1)
;
INSERT into "SyncRS_ItemCommentLogType" ("Id","Name","IsActive") VALUES ("SyncRS_ItemCommentLogType_seq".nextval,'Edited',1)
;
INSERT into "SyncRS_ItemCommentLogType" ("Id","Name","IsActive") VALUES ("SyncRS_ItemCommentLogType_seq".nextval,'Deleted',1)
;
INSERT into "SyncRS_ItemCommentLogType" ("Id","Name","IsActive") VALUES ("SyncRS_ItemCommentLogType_seq".nextval,'Upvoted',1)
;
INSERT into "SyncRS_ItemCommentLogType" ("Id","Name","IsActive") VALUES ("SyncRS_ItemCommentLogType_seq".nextval,'Downvoted',1)
;
INSERT into "SyncRS_ItemCommentLogType" ("Id","Name","IsActive") VALUES ("SyncRS_ItemCommentLogType_seq".nextval,'Replied',1)
;
INSERT into "SyncRS_ItemCommentLogType" ("Id","Name","IsActive") VALUES ("SyncRS_ItemCommentLogType_seq".nextval,'UserMention',1)
;
INSERT into "SyncRS_UserType" ("Id","Type") values("SyncRS_UserType_seq".nextval,'Server User')
;
INSERT into "SyncRS_UserType" ("Id","Type") values("SyncRS_UserType_seq".nextval,'Active Directory User')
;
INSERT into "SyncRS_UserType" ("Id","Type") values("SyncRS_UserType_seq".nextval,'Federation User')
;

CREATE TABLE "SyncRS_DBCredential"(
    "Id" int PRIMARY KEY NOT NULL,
    "DatabaseType" NVARCHAR2(255) NOT NULL,
    "ConnectionString" VARCHAR2(4000) NOT NULL,
    "Status"  NVARCHAR2(255) NOT NULL,
    "ActiveStatusValue"  NVARCHAR2(255) NOT NULL,
    "UserNameSchema" NVARCHAR2(255) NOT NULL,
    "UserNameTable" NVARCHAR2(255) NOT NULL,
    "UserNameColumn" NVARCHAR2(255) NOT NULL,
    "FirstNameSchema" NVARCHAR2(255) NOT NULL,
    "FirstNameTable" NVARCHAR2(255) NOT NULL,
    "FirstNameColumn" NVARCHAR2(255) NOT NULL,
    "LastNameSchema" NVARCHAR2(255) NOT NULL,
    "LastNameTable" NVARCHAR2(255) NOT NULL,
    "LastNameColumn" NVARCHAR2(255) NOT NULL,
    "EmailSchema" NVARCHAR2(255) NOT NULL,
    "EmailTable" NVARCHAR2(255) NOT NULL,
    "EmailColumn" NVARCHAR2(255) NOT NULL,
    "IsActiveColumn" NVARCHAR2(255) NOT NULL,
    "IsActiveSchema" NVARCHAR2(255) NOT NULL,
    "IsActiveTable" NVARCHAR2(255) NOT NULL,
    "EmailRelationId" int NULL,
    "FirstNameRelationId" int NULL,
    "IsActiveRelationId" int NULL,
    "LastNameRelationId" int NULL,
    "IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_DBCredential_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

CREATE TABLE "SyncRS_TableRelation"(
    "Id" int PRIMARY KEY NOT NULL,
    "LeftTable" NVARCHAR2(255) NOT NULL,
    "LeftTableColumnName" NVARCHAR2(255) NOT NULL,	
    "LeftTableCondition"  NVARCHAR2(255) NOT NULL,
    "LeftTableName"  NVARCHAR2(255) NOT NULL,
    "LeftTableSchema" NVARCHAR2(255) NOT NULL,
    "Relationship" NVARCHAR2(255) NOT NULL,
    "RightTable" NVARCHAR2(255) NOT NULL,
    "RightTableColumnName" NVARCHAR2(255) NOT NULL,	
    "RightTableCondition"  NVARCHAR2(255) NOT NULL,
    "RightTableName"  NVARCHAR2(255) NOT NULL,
    "RightTableSchema" NVARCHAR2(255) NOT NULL)
;

CREATE SEQUENCE "SyncRS_TableRelation_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

CREATE TABLE "SyncRS_ScheduleParameter" (
    "Id" int PRIMARY KEY NOT NULL,
    "ScheduleId" NCHAR(36) NOT NULL,
    "Parameter" VARCHAR2(4000) NOT NULL,
    "IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_ScheduleParameter_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncRS_ScheduleParameter" ADD FOREIGN KEY("ScheduleId") REFERENCES "SyncRS_Item" ("Id")
;

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

CREATE TABLE "SyncRS_UmsCredential"(
	"Id" int PRIMARY KEY NOT NULL,
	"UmsUrl" NVARCHAR2(255),
	"ClientId" NVARCHAR2(255),
	"ClientSecret" NVARCHAR2(255),
    "IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_UmsCredential_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

CREATE TABLE "SyncRS_UmsUser"(
	"Id" int PRIMARY KEY NOT NULL,
	"UserId" int NOT NULL,
	"UmsUserId" int NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
	;

CREATE SEQUENCE "SyncRS_UmsUser_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncRS_UmsUser" ADD FOREIGN KEY("UserId") REFERENCES "SyncRS_User" ("Id")
;

CREATE TABLE "SyncRS_UmsGroup"(
	"Id" int PRIMARY KEY NOT NULL,
	"GroupId" int NOT NULL,
	"UmsGroupId" int NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
	;

CREATE SEQUENCE "SyncRS_UmsGroup_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncRS_UmsGroup" ADD FOREIGN KEY("GroupId") REFERENCES "SyncRS_Group" ("Id")
;