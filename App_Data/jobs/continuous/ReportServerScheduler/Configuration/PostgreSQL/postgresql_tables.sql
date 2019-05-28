CREATE TABLE SyncRS_User(
	Id SERIAL primary key NOT NULL,
	UserName varchar(100) NOT NULL,
	FirstName varchar(255) NOT NULL,
	LastName varchar(255) NULL,
	DisplayName varchar(512) NULL,
	Email varchar(255) NOT NULL,
	Password varchar(255) NOT NULL,
	Contact varchar(20) NULL,
	Picture varchar(100) NOT NULL,	
	CreatedDate timestamp NOT NULL,
	ModifiedDate timestamp NULL,
	LastLogin timestamp NULL,
	PasswordChangedDate timestamp NULL,
	ActivationExpirationDate timestamp NULL,
	ActivationCode varchar(255) NOT NULL,
	ResetPasswordCode varchar(255) NULL,
	LastResetAttempt timestamp NULL,
	UserTypeId int NOT NULL DEFAULT 0,
	IsActivated smallint NOT NULL,
	IsActive smallint NOT NULL,
	IsDeleted smallint NOT NULL,
	DomainId varchar(4000) NULL)
;

CREATE TABLE SyncRS_Group(
	Id SERIAL PRIMARY KEY NOT NULL,
	Name varchar(255) NOT NULL,
	Description varchar(1026) NULL,
	Color varchar(255) NULL,
	ModifiedDate timestamp NOT NULL,
	IsActive smallint NOT NULL,
	DomainId varchar(4000) NULL)
;

CREATE TABLE SyncRS_UserGroup(
	Id SERIAL PRIMARY KEY NOT NULL,
	GroupId int NOT NULL,
	UserId int NOT NULL,
	ModifiedDate timestamp NOT NULL,
	IsActive smallint NOT NULL)
;

ALTER TABLE SyncRS_UserGroup  ADD FOREIGN KEY(GroupId) REFERENCES SyncRS_Group (Id)
;
ALTER TABLE SyncRS_UserGroup  ADD FOREIGN KEY(UserId) REFERENCES SyncRS_User (Id)
;

CREATE TABLE SyncRS_UserLogType(
	Id SERIAL primary key NOT NULL,
	Name varchar(100) NOT NULL UNIQUE,
	IsActive smallint NOT NULL)
;

CREATE TABLE SyncRS_UserLog(
	Id SERIAL primary key NOT NULL,
	UserLogTypeId int NOT NULL,	
	GroupId int NULL,
	OldValue int NULL,
	NewValue int NULL,
	UpdatedUserId int NOT NULL,
	TargetUserId int NOT NULL,
	ModifiedDate timestamp NOT NULL,
	IsActive smallint NOT NULL)
;

ALTER TABLE SyncRS_UserLog  ADD  FOREIGN KEY(UserLogTypeId) REFERENCES SyncRS_UserLogType (Id)
;
ALTER TABLE SyncRS_UserLog  ADD  FOREIGN KEY(GroupId) REFERENCES SyncRS_Group (Id)
;
ALTER TABLE SyncRS_UserLog  ADD  FOREIGN KEY(TargetUserId) REFERENCES SyncRS_User (Id)
;
ALTER TABLE SyncRS_UserLog  ADD  FOREIGN KEY(UpdatedUserId) REFERENCES SyncRS_User (Id)
;

CREATE TABLE SyncRS_UserLogin(
	Id SERIAL PRIMARY KEY NOT NULL,
	UserId int NOT NULL,
	ClientToken varchar(4000) NOT NULL,
	IpAddress varchar(50) NOT NULL,
	LoggedInTime timestamp NOT NULL,
	IsActive smallint NOT NULL)
;

ALTER TABLE SyncRS_UserLogin  ADD FOREIGN KEY(UserId) REFERENCES SyncRS_User (Id)
;

CREATE TABLE SyncRS_UserPreference(
	Id SERIAL PRIMARY KEY NOT NULL,
	UserId int NOT NULL,
	Language varchar(4000) NULL,
	TimeZone varchar(100) NULL,
	RecordSize int NULL,
	ItemSort varchar(4000) NULL,
	ItemFilters varchar(4000) NULL,
	Notifications varchar(4000) NULL,
	ModifiedDate timestamp NOT NULL,
	IsActive smallint NOT NULL)
;

ALTER TABLE SyncRS_UserPreference ADD FOREIGN KEY(UserId) REFERENCES SyncRS_User (Id)
;

CREATE TABLE SyncRS_SystemLogType(
	Id SERIAL primary key NOT NULL,
	Name varchar(100) NOT NULL UNIQUE,
	IsActive smallint NOT NULL)
;

CREATE TABLE SyncRS_SystemLog(
	LogId SERIAL primary key NOT NULL,
	SystemLogTypeId int NOT NULL,
	UpdatedUserId int NOT NULL,
	TargetUserId int NOT NULL,		
	ModifiedDate timestamp NOT NULL,
	IsActive smallint NOT NULL)
;

ALTER TABLE SyncRS_SystemLog  ADD FOREIGN KEY(SystemLogTypeId) REFERENCES SyncRS_SystemLogType (Id)
;
ALTER TABLE SyncRS_SystemLog  ADD FOREIGN KEY(UpdatedUserId) REFERENCES SyncRS_User (Id)
;
ALTER TABLE SyncRS_SystemLog  ADD FOREIGN KEY(TargetUserId) REFERENCES SyncRS_User (Id)
;

CREATE TABLE SyncRS_ItemType(
	Id SERIAL PRIMARY KEY NOT NULL,
	Name varchar(100) NOT NULL UNIQUE,
	IsActive smallint NULL)
;

CREATE TABLE SyncRS_Item(
	Id uuid PRIMARY KEY NOT NULL,
	Name varchar(255) NOT NULL,
	Description varchar(1026) NULL,
	ItemTypeId int NOT NULL,
	ParentId uuid NULL,
	Extension varchar(30) NULL,
	CloneItemId uuid NULL,
	CreatedById int NOT NULL,
	ModifiedById int NOT NULL,
	CreatedDate timestamp NOT NULL,
	ModifiedDate timestamp NOT NULL,
	IsPublic smallint NOT NULL DEFAULT 0,
	IsActive smallint NULL,
	IsWebDesignerCompatible smallint NOT NULL DEFAULT 0)
;

ALTER TABLE SyncRS_Item  ADD FOREIGN KEY(ItemTypeId) REFERENCES SyncRS_ItemType (Id)
;
ALTER TABLE SyncRS_Item  ADD FOREIGN KEY(ParentId) REFERENCES SyncRS_Item (Id)
;
ALTER TABLE SyncRS_Item  ADD FOREIGN KEY(CreatedById) REFERENCES SyncRS_User (Id)
;
ALTER TABLE SyncRS_Item  ADD FOREIGN KEY(ModifiedById) REFERENCES SyncRS_User (Id)
;

CREATE TABLE SyncRS_ItemView(
	Id SERIAL PRIMARY KEY NOT NULL,
	ItemId uuid NOT NULL,
	UserId int NOT NULL,
	ItemViewId uuid NOT NULL,
	QueryString varchar(4000) NOT NULL,
	ModifiedDate timestamp NOT NULL,
	IsActive smallint NOT NULL)
;

ALTER TABLE SyncRS_ItemView  ADD FOREIGN KEY(ItemId) REFERENCES SyncRS_Item (Id)
;
ALTER TABLE SyncRS_ItemView  ADD FOREIGN KEY(ItemViewId) REFERENCES SyncRS_Item (Id)
;
ALTER TABLE SyncRS_ItemView  ADD FOREIGN KEY(UserId) REFERENCES SyncRS_User (Id)
;

CREATE TABLE SyncRS_ProcessOption(
	Id SERIAL PRIMARY KEY NOT NULL,
	ItemId uuid NOT NULL,
	ProcessOption varchar(4000) NULL,
	NextScheduleDate timestamp NULL,
	CreatedDate timestamp NOT NULL,
	ModifiedDate timestamp NOT NULL,
	IsActive smallint NOT NULL)
;

ALTER TABLE SyncRS_ProcessOption  ADD FOREIGN KEY(ItemId) REFERENCES SyncRS_Item (Id)
;

CREATE TABLE SyncRS_ProcessOptionMap(
	Id SERIAL PRIMARY KEY NOT NULL,
	ProcessOptionId int NOT NULL,
	ItemId uuid NOT NULL,
	IsActive smallint NOT NULL)
;
ALTER TABLE SyncRS_ProcessOptionMap  ADD FOREIGN KEY(ProcessOptionId) REFERENCES SyncRS_ProcessOption (Id)
;
ALTER TABLE SyncRS_ProcessOptionMap  ADD FOREIGN KEY(ItemId) REFERENCES SyncRS_Item (Id)
;

CREATE TABLE SyncRS_ItemLogType(
	Id SERIAL PRIMARY KEY NOT NULL,
	Name varchar(100) NULL UNIQUE,
	IsActive smallint NULL)
;


CREATE TABLE SyncRS_ItemTrash(
	Id SERIAL PRIMARY KEY NOT NULL,
	ItemId uuid NOT NULL,
	TrashedById int NOT NULL,
	TrashedDate timestamp NOT NULL,
	IsActive smallint NOT NULL)
;

ALTER TABLE SyncRS_ItemTrash  ADD FOREIGN KEY(ItemId) REFERENCES SyncRS_Item (Id)
;
ALTER TABLE SyncRS_ItemTrash  ADD FOREIGN KEY(TrashedById) REFERENCES SyncRS_User (Id)
;

CREATE TABLE SyncRS_ItemTrashDeleted(
	Id SERIAL PRIMARY KEY NOT NULL,
	ItemId uuid NOT NULL,
	ItemTrashId int NOT NULL,
	DeletedById int NOT NULL,
	DeletedDate timestamp NOT NULL,
	IsActive smallint NOT NULL)
;

ALTER TABLE SyncRS_ItemTrashDeleted  ADD FOREIGN KEY(ItemId) REFERENCES SyncRS_Item (Id)
;
ALTER TABLE SyncRS_ItemTrashDeleted  ADD FOREIGN KEY(ItemTrashId) REFERENCES SyncRS_ItemTrash (Id)
;
ALTER TABLE SyncRS_ItemTrashDeleted  ADD FOREIGN KEY(DeletedById) REFERENCES SyncRS_User (Id)
;

CREATE TABLE SyncRS_ItemVersion(
	Id SERIAL PRIMARY KEY NOT NULL,
	ItemId uuid NOT NULL,
	ItemTypeId int NOT NULL,
	ItemName varchar(265) NULL,
	VersionNumber int NOT NULL,
	RolledbackVersionNumber int NULL,
	Comment varchar(1026) NULL,
	IsCurrentVersion smallint NOT NULL,
	CreatedById int NOT NULL,
	CreatedDate timestamp NOT NULL,
	IsActive smallint NOT NULL)
;

ALTER TABLE SyncRS_ItemVersion  ADD FOREIGN KEY(ItemTypeId) REFERENCES SyncRS_ItemType (Id)
;
ALTER TABLE SyncRS_ItemVersion  ADD FOREIGN KEY(ItemId) REFERENCES SyncRS_Item (Id)
;
ALTER TABLE SyncRS_ItemVersion  ADD FOREIGN KEY(CreatedById) REFERENCES SyncRS_User (Id)
;

CREATE TABLE SyncRS_ItemLog(
	Id SERIAL PRIMARY KEY NOT NULL,
	ItemLogTypeId int NOT NULL,
	ItemId uuid NOT NULL,
	ItemVersionId int NOT NULL,
	ParentId uuid NULL,
	FromCategoryId uuid NULL,
	ToCategoryId uuid NULL,
	UpdatedUserId int NOT NULL,	
	ModifiedDate timestamp NOT NULL,
	IsActive smallint NOT NULL)
;

ALTER TABLE SyncRS_ItemLog  ADD FOREIGN KEY(ItemVersionId) REFERENCES SyncRS_ItemVersion (Id)
;
ALTER TABLE SyncRS_ItemLog  ADD FOREIGN KEY(ItemLogTypeId) REFERENCES SyncRS_ItemLogType (Id)
;
ALTER TABLE SyncRS_ItemLog  ADD FOREIGN KEY(ItemId) REFERENCES SyncRS_Item (Id)
;
ALTER TABLE SyncRS_ItemLog  ADD FOREIGN KEY(ParentId) REFERENCES SyncRS_Item (Id)
;
ALTER TABLE SyncRS_ItemLog  ADD FOREIGN KEY(FromCategoryId) REFERENCES SyncRS_Item (Id)
;
ALTER TABLE SyncRS_ItemLog  ADD FOREIGN KEY(ToCategoryId) REFERENCES SyncRS_Item (Id)
;
ALTER TABLE SyncRS_ItemLog  ADD FOREIGN KEY(UpdatedUserId) REFERENCES SyncRS_User (Id)
;


CREATE TABLE SyncRS_PermissionEntity(
	Id SERIAL PRIMARY KEY NOT NULL,
	Name varchar(100) NOT NULL UNIQUE,
	EntityType int NOT NULL,
	ItemTypeId int NOT NULL,
	IsActive smallint NOT NULL)
;
ALTER TABLE SyncRS_PermissionEntity  ADD FOREIGN KEY(ItemTypeId) REFERENCES SyncRS_ItemType (Id)
;

CREATE TABLE SyncRS_UserPermission(
	Id SERIAL PRIMARY KEY NOT NULL,
	PermissionAccessId int NOT NULL,
	PermissionEntityId int NOT NULL,
	ItemId uuid NULL,
	UserId int NOT NULL,
	IsActive smallint NOT NULL)
;

ALTER TABLE SyncRS_UserPermission  ADD  FOREIGN KEY(PermissionEntityId) REFERENCES SyncRS_PermissionEntity (Id)
;
ALTER TABLE SyncRS_UserPermission  ADD  FOREIGN KEY(ItemId) REFERENCES SyncRS_Item (Id)
;
ALTER TABLE SyncRS_UserPermission  ADD  FOREIGN KEY(UserId) REFERENCES SyncRS_User (Id)
;

CREATE TABLE SyncRS_GroupPermission(
	Id SERIAL PRIMARY KEY NOT NULL,
	PermissionAccessId int NOT NULL,
	PermissionEntityId int NOT NULL,
	ItemId uuid NULL,
	GroupId int NOT NULL,
	IsActive smallint NOT NULL)
;

ALTER TABLE SyncRS_GroupPermission  ADD  FOREIGN KEY(PermissionEntityId) REFERENCES SyncRS_PermissionEntity (Id)
;
ALTER TABLE SyncRS_GroupPermission  ADD  FOREIGN KEY(ItemId) REFERENCES SyncRS_Item (Id)
;
ALTER TABLE SyncRS_GroupPermission  ADD  FOREIGN KEY(GroupId) REFERENCES SyncRS_Group (Id)
;

CREATE TABLE SyncRS_RecurrenceType(
	Id SERIAL PRIMARY KEY NOT NULL,
	Name varchar(30) NOT NULL UNIQUE,
	IsActive smallint NOT NULL)
;

CREATE TABLE SyncRS_ExportType(
	Id SERIAL PRIMARY KEY NOT NULL,
	Name varchar(20) NOT NULL UNIQUE,
	IsActive smallint NOT NULL)
;

CREATE TABLE SyncRS_ScheduleDetail(
	Id SERIAL PRIMARY KEY NOT NULL,
	ScheduleId uuid NOT NULL,
	ItemId uuid NOT NULL,
	Name varchar(150) NOT NULL,
	RecurrenceTypeId int NOT NULL,
	RecurrenceInfo varchar(4000) NOT NULL,
	ExportFileSettingsInfo varchar(4000) NULL,
	StartDate timestamp NOT NULL,
	EndDate timestamp NULL,
	EndAfter int NOT NULL DEFAULT 0,
	NextSchedule timestamp,
	ExportTypeId int NOT NULL,
	IsEnabled smallint NOT NULL,
	IsParameterEnabled smallint NOT NULL,
	IsSaveAsFile smallint NOT NULL,
    IsSendAsMail smallint NOT NULL DEFAULT 1,
    ReportCount int NOT NULL DEFAULT 0,
    ExportPath varchar(4000) NULL,
	CreatedById int NOT NULL,
	ModifiedById int NOT NULL,
	CreatedDate timestamp NOT NULL,
	ModifiedDate timestamp NOT NULL,
	IsActive smallint NOT NULL)
;

ALTER TABLE SyncRS_ScheduleDetail  ADD FOREIGN KEY(ScheduleId) REFERENCES SyncRS_Item (Id)
;
ALTER TABLE SyncRS_ScheduleDetail  ADD FOREIGN KEY(ItemId) REFERENCES SyncRS_Item (Id)
;
ALTER TABLE SyncRS_ScheduleDetail  ADD FOREIGN KEY(RecurrenceTypeId) REFERENCES SyncRS_RecurrenceType (Id)
;
ALTER TABLE SyncRS_ScheduleDetail  ADD FOREIGN KEY(ExportTypeId) REFERENCES SyncRS_ExportType (Id)
;
ALTER TABLE SyncRS_ScheduleDetail  ADD FOREIGN KEY(CreatedById) REFERENCES SyncRS_User (Id)
;
ALTER TABLE SyncRS_ScheduleDetail  ADD FOREIGN KEY(ModifiedById) REFERENCES SyncRS_User (Id)
;

CREATE TABLE SyncRS_SubscribedUser(
	Id SERIAL PRIMARY KEY NOT NULL,
	ScheduleId uuid NOT NULL,
	SubscribedById int NOT NULL,
	RecipientUserId int NOT NULL,
	SubscribedDate timestamp NOT NULL,
	ModifiedDate timestamp NOT NULL,
	IsActive smallint NOT NULL)
;

ALTER TABLE SyncRS_SubscribedUser  ADD FOREIGN KEY(ScheduleId) REFERENCES SyncRS_Item (Id)
;
ALTER TABLE SyncRS_SubscribedUser  ADD FOREIGN KEY(SubscribedById) REFERENCES SyncRS_User (Id)
;
ALTER TABLE SyncRS_SubscribedUser  ADD FOREIGN KEY(RecipientUserId) REFERENCES SyncRS_User (Id)
;

CREATE TABLE SyncRS_SubscribedGroup(
	Id SERIAL PRIMARY KEY NOT NULL,
	ScheduleId uuid NOT NULL,
	SubscribedById int NOT NULL,
	RecipientGroupId int NOT NULL,
	SubscribedDate timestamp NOT NULL,
	ModifiedDate timestamp NOT NULL,
	IsActive smallint NOT NULL)
;

ALTER TABLE SyncRS_SubscribedGroup  ADD FOREIGN KEY(ScheduleId) REFERENCES SyncRS_Item (Id)
;
ALTER TABLE SyncRS_SubscribedGroup  ADD FOREIGN KEY(SubscribedById) REFERENCES SyncRS_User (Id)
;
ALTER TABLE SyncRS_SubscribedGroup  ADD FOREIGN KEY(RecipientGroupId) REFERENCES SyncRS_Group (Id)
;

CREATE TABLE SyncRS_SubscrExtnRecpt(
	Id SERIAL PRIMARY KEY NOT NULL,
	ScheduleId uuid NOT NULL,
	SubscribedById int NOT NULL,
	EmailIds varchar(4000) NOT NULL,
	SubscribedDate timestamp NOT NULL,
	ModifiedDate timestamp NOT NULL,
	IsActive smallint NOT NULL);
	
ALTER TABLE SyncRS_SubscrExtnRecpt  ADD FOREIGN KEY(ScheduleId) REFERENCES SyncRS_Item (Id)
;
ALTER TABLE SyncRS_SubscrExtnRecpt  ADD FOREIGN KEY(SubscribedById) REFERENCES SyncRS_User (Id)
;

CREATE TABLE SyncRS_ScheduleStatus(
	Id SERIAL PRIMARY KEY NOT NULL,
	Name varchar(100) NOT NULL,
	IsActive smallint NOT NULL)
;

CREATE TABLE SyncRS_ScheduleLogUser(
	Id SERIAL PRIMARY KEY NOT NULL,
	ScheduleId uuid NOT NULL,
	ScheduleStatusId int NOT NULL,
	DeliveredUserId int NOT NULL,
	DeliveredDate timestamp NOT NULL,
	IsOnDemand smallint NOT NULL,	
	IsActive smallint NOT NULL)
;

ALTER TABLE SyncRS_ScheduleLogUser  ADD FOREIGN KEY(ScheduleStatusId) REFERENCES SyncRS_ScheduleStatus (Id)
;
ALTER TABLE SyncRS_ScheduleLogUser  ADD FOREIGN KEY(ScheduleId) REFERENCES SyncRS_Item (Id)
;
ALTER TABLE SyncRS_ScheduleLogUser  ADD FOREIGN KEY(DeliveredUserId) REFERENCES SyncRS_User (Id)
;

CREATE TABLE SyncRS_ScheduleLogGroup(
	Id SERIAL PRIMARY KEY NOT NULL,
	ScheduleId uuid NOT NULL,
	ScheduleStatusId int NOT NULL,
	GroupId int NOT NULL,
	DeliveredUserId int NOT NULL,
	DeliveredDate timestamp NOT NULL,
	IsOnDemand smallint NOT NULL,
	IsActive smallint NOT NULL)
;

ALTER TABLE SyncRS_ScheduleLogGroup  ADD FOREIGN KEY(ScheduleStatusId) REFERENCES SyncRS_ScheduleStatus (Id)
;
ALTER TABLE SyncRS_ScheduleLogGroup  ADD FOREIGN KEY(ScheduleId) REFERENCES SyncRS_Item (Id)
;
ALTER TABLE SyncRS_ScheduleLogGroup  ADD FOREIGN KEY(GroupId) REFERENCES SyncRS_Group (Id)
;
ALTER TABLE SyncRS_ScheduleLogGroup  ADD FOREIGN KEY(DeliveredUserId) REFERENCES SyncRS_User (Id)
;

CREATE TABLE SyncRS_SchdLogExtnRecpt(
	Id SERIAL PRIMARY KEY NOT NULL,
	ScheduleId uuid NOT NULL,
	ScheduleStatusId int NOT NULL,
	DeliveredEmailId varchar(150) NOT NULL,
	DeliveredDate timestamp NOT NULL,
	IsOnDemand smallint NOT NULL,	
	IsActive smallint NOT NULL);
	
ALTER TABLE SyncRS_SchdLogExtnRecpt  ADD FOREIGN KEY(ScheduleStatusId) REFERENCES SyncRS_ScheduleStatus (Id)
;
ALTER TABLE SyncRS_SchdLogExtnRecpt  ADD FOREIGN KEY(ScheduleId) REFERENCES SyncRS_Item (Id)
;

CREATE TABLE SyncRS_ReportDataSource(
	Id SERIAL PRIMARY KEY NOT NULL,
	ReportItemId uuid NOT NULL,
	DataSourceItemId uuid NOT NULL,
	Name varchar(255) NOT NULL,
	ModifiedDate timestamp NOT NULL,
	IsActive smallint NOT NULL)
;

ALTER TABLE SyncRS_ReportDataSource  ADD FOREIGN KEY(ReportItemId) REFERENCES SyncRS_Item (Id)
;
ALTER TABLE SyncRS_ReportDataSource  ADD FOREIGN KEY(DataSourceItemId) REFERENCES SyncRS_Item (Id)
;

CREATE TABLE SyncRS_ScheduleLog(
	Id SERIAL PRIMARY KEY NOT NULL,
	ScheduleStatusId int NOT NULL,
	ScheduleId uuid NOT NULL,
	ExecutedDate timestamp NOT NULL,
	ModifiedDate timestamp NOT NULL,
	IsOnDemand smallint NOT NULL DEFAULT (0),
	IsActive smallint NOT NULL)
;

ALTER TABLE SyncRS_ScheduleLog  ADD FOREIGN KEY(ScheduleStatusId) REFERENCES SyncRS_ScheduleStatus (Id)
;
ALTER TABLE SyncRS_ScheduleLog  ADD FOREIGN KEY(ScheduleId) REFERENCES SyncRS_Item (Id)
;

CREATE TABLE SyncRS_SystemSettings(
	Id SERIAL PRIMARY KEY NOT NULL,
	Key varchar(255) NOT NULL,
	Value varchar(4000) NULL,
	ModifiedDate timestamp NOT NULL,
	IsActive smallint NOT NULL,
	CONSTRAINT UK_SyncRS_SystemSettings_Key UNIQUE (Key))
;

CREATE TABLE SyncRS_DataSourceDetail(
	Id SERIAL PRIMARY KEY NOT NULL,
	DataSourceId uuid NOT NULL,
	Password varchar(255) NOT NULL,
	ModifiedDate timestamp NOT NULL,
	IsActive smallint NOT NULL)
;

ALTER TABLE SyncRS_DataSourceDetail ADD FOREIGN KEY(DataSourceId) REFERENCES SyncRS_Item (Id)
;

CREATE TABLE SyncRS_ServerVersion(
Id int PRIMARY KEY NOT NULL,
VersionNumber varchar(20) NOT NULL)
;

CREATE TABLE SyncRS_ADUser(
Id SERIAL primary key NOT NULL,
UserId int NOT NULL,
ActiveDirectoryUserId uuid NOT NULL,
IsActive smallint NOT NULL)
;

ALTER TABLE SyncRS_ADUser ADD FOREIGN KEY(UserId) REFERENCES SyncRS_User (Id)
;

CREATE TABLE SyncRS_ADGroup(
Id SERIAL primary key NOT NULL,
GroupId int NOT NULL,
ActiveDirectoryGroupId uuid NOT NULL,
IsActive smallint NOT NULL)
;

ALTER TABLE SyncRS_ADGroup ADD FOREIGN KEY(GroupId) REFERENCES SyncRS_Group (Id)
;

CREATE TABLE SyncRS_ADCredential(
Id SERIAL primary key NOT NULL,
Username varchar(100),
Password varchar(100),
LdapUrl varchar(255),
EnableSsl smallint NOT NULL,
DistinguishedName varchar(150),
PortNo int NOT NULL,
IsActive smallint NOT NULL)
;

CREATE TABLE SyncRS_DatasetLinkage(
	Id SERIAL PRIMARY KEY NOT NULL,
	DatasetItemId uuid NOT NULL,
	ItemId uuid NOT NULL,
	Name varchar(255) NOT NULL,
	ModifiedDate timestamp NOT NULL,
	IsActive smallint NOT NULL)
;

ALTER TABLE SyncRS_DatasetLinkage  ADD FOREIGN KEY(DatasetItemId) REFERENCES SyncRS_Item (Id)
;
ALTER TABLE SyncRS_DatasetLinkage  ADD FOREIGN KEY(ItemId) REFERENCES SyncRS_Item (Id)
;

CREATE TABLE SyncRS_FavoriteItem(
	Id SERIAL PRIMARY KEY NOT NULL,
	UserId int NOT NULL,
	ItemId uuid NOT NULL,
	IsActive smallint NOT NULL)
;
	
ALTER TABLE SyncRS_FavoriteItem  ADD FOREIGN KEY(UserId) REFERENCES SyncRS_User (Id)
;
ALTER TABLE SyncRS_FavoriteItem  ADD FOREIGN KEY(ItemId) REFERENCES SyncRS_Item (Id)
;


CREATE TABLE SyncRS_Comment(
    Id SERIAL PRIMARY KEY NOT NULL,
    Comment varchar(4000) NOT NULL,
    ItemId uuid NOT NULL,
    UserId int NOT NULL,
    ParentId int NULL,
    CreatedDate timestamp NOT NULL,
    ModifiedDate timestamp NOT NULL,
    ModifiedById int NOT NULL,
    IsActive smallint NOT NULL)
;

ALTER TABLE SyncRS_Comment ADD FOREIGN KEY(ItemId) REFERENCES SyncRS_Item (Id)
;
ALTER TABLE SyncRS_Comment ADD FOREIGN KEY(UserId) REFERENCES SyncRS_User (Id)
;
ALTER TABLE SyncRS_Comment ADD FOREIGN KEY(ModifiedById) REFERENCES SyncRS_User (Id)
; 

CREATE TABLE SyncRS_ItemWatch(
            Id SERIAL PRIMARY KEY NOT NULL,
            ItemId uuid NOT NULL,
            UserId int NOT NULL,
            ModifiedDate timestamp NOT NULL,
			IsWatched smallint NOT NULL,
            IsActive smallint NOT NULL)
;
 
ALTER TABLE SyncRS_ItemWatch ADD FOREIGN KEY(ItemId) REFERENCES SyncRS_Item (Id)
;
ALTER TABLE SyncRS_ItemWatch ADD FOREIGN KEY(UserId) REFERENCES SyncRS_User (Id)
;  

CREATE TABLE SyncRS_ItemCommentLogType(
    Id SERIAL PRIMARY KEY NOT NULL,
    Name varchar(100) NULL UNIQUE,
    IsActive smallint NULL)
;

CREATE TABLE SyncRS_ItemCommentLog(
    Id SERIAL PRIMARY KEY NOT NULL,
    ItemCommentLogTypeId int NOT NULL,
    CurrentUserId int NOT NULL,    
    CommentId int NOT NULL,
	Url varchar(4000) NOT NULL,
    ClubId varchar(100) NOT NULL,
    RepliedFor int NULL,
    OldValue varchar(4000) NULL,
    NewValue varchar(4000) NULL,
    NotificationTo int NULL,    
    ModifiedDate timestamp NOT NULL,
    IsRead smallint NOT NULL,
    IsActive smallint NOT NULL)
;

ALTER TABLE SyncRS_ItemCommentLog  ADD FOREIGN KEY(CurrentUserId) REFERENCES SyncRS_User (Id)
;
ALTER TABLE SyncRS_ItemCommentLog  ADD FOREIGN KEY(ItemCommentLogTypeId) REFERENCES SyncRS_ItemCommentLogType (Id)
;
ALTER TABLE SyncRS_ItemCommentLog  ADD FOREIGN KEY(CommentId) REFERENCES SyncRS_Comment (Id)
;
ALTER TABLE SyncRS_ItemCommentLog  ADD FOREIGN KEY(RepliedFor) REFERENCES SyncRS_Comment (Id)
;
ALTER TABLE SyncRS_ItemCommentLog  ADD FOREIGN KEY(NotificationTo) REFERENCES SyncRS_User (Id)
;

CREATE TABLE SyncRS_AzureADCredential(
Id SERIAL primary key NOT NULL,
TenantName varchar(255),
ClientId varchar(100),
ClientSecret varchar(100),
IsActive smallint NOT NULL)
;

CREATE TABLE SyncRS_AzureADUser(
Id SERIAL primary key NOT NULL,
UserId int NOT NULL,
AzureADUserId uuid NOT NULL,
IsActive smallint NOT NULL)
;

ALTER TABLE SyncRS_AzureADUser ADD FOREIGN KEY(UserId) REFERENCES SyncRS_User (Id)
;

CREATE TABLE SyncRS_AzureADGroup(
Id SERIAL primary key NOT NULL,
GroupId int NOT NULL,
AzureADGroupId uuid NOT NULL,
IsActive smallint NOT NULL)
;

ALTER TABLE SyncRS_AzureADGroup ADD FOREIGN KEY(GroupId) REFERENCES SyncRS_Group (Id)
;


CREATE TABLE SyncRS_SAMLSettings(
	Id SERIAL primary key NOT NULL, 
	MetadataURI varchar(4000),
	Authority varchar(4000),
	DesignerClientId varchar(100), 
	TenantName varchar(100),
	MobileAppId varchar(100), 
	IsEnabled smallint NOT NULL)
;

CREATE TABLE SyncRS_UserType(
	Id SERIAL primary key NOT NULL, 
	Type varchar(100) UNIQUE)
;

INSERT into SyncRS_ItemType (Name,IsActive) VALUES (N'Category',1)
;
INSERT into SyncRS_ItemType (Name,IsActive) VALUES (N'Dashboard',1)
;
INSERT into SyncRS_ItemType (Name,IsActive) VALUES (N'Report',1)
;
INSERT into SyncRS_ItemType (Name,IsActive) VALUES (N'Datasource',1)
;
INSERT into SyncRS_ItemType (Name,IsActive) VALUES (N'Dataset',1)
;
INSERT into SyncRS_ItemType (Name,IsActive) VALUES (N'File',1)
;
INSERT into SyncRS_ItemType (Name,IsActive) VALUES (N'Schedule',1)
;
insert into SyncRS_ItemType (Name,IsActive) values (N'Widget',1)
;
insert into SyncRS_ItemType (Name,IsActive) values (N'ItemView',1)
;


INSERT into SyncRS_ItemLogType (Name,IsActive) VALUES ( N'Added',1)
;
INSERT into SyncRS_ItemLogType (Name,IsActive) VALUES ( N'Edited',1)
;
INSERT into SyncRS_ItemLogType (Name,IsActive) VALUES ( N'Deleted',1)
;
INSERT into SyncRS_ItemLogType (Name,IsActive) VALUES ( N'Moved',1)
;
INSERT into SyncRS_ItemLogType (Name,IsActive) VALUES ( N'Copied',1)
;
INSERT into SyncRS_ItemLogType (Name,IsActive) VALUES ( N'Cloned',1)
;
INSERT into SyncRS_ItemLogType (Name,IsActive) VALUES ( N'Trashed',1)
;
INSERT into SyncRS_ItemLogType (Name,IsActive) VALUES ( N'Restored',1)
;
INSERT into SyncRS_ItemLogType (Name,IsActive) VALUES ( N'Rollbacked',1)
;

INSERT into SyncRS_SystemLogType (Name,IsActive) VALUES (N'Updated',1)
;

INSERT into SyncRS_UserLogType (Name,IsActive) VALUES ( N'Added',1)
;
INSERT into SyncRS_UserLogType (Name,IsActive) VALUES ( N'Updated',1)
;
INSERT into SyncRS_UserLogType (Name,IsActive) VALUES ( N'Deleted',1)
;
INSERT into SyncRS_UserLogType (Name,IsActive) VALUES ( N'Changed',1)
;

INSERT into SyncRS_ExportType (Name,IsActive) VALUES (N'Excel', 1)
;
INSERT into SyncRS_ExportType (Name,IsActive) VALUES (N'HTML', 1)
;
INSERT into SyncRS_ExportType (Name,IsActive) VALUES (N'PDF', 1)
;
INSERT into SyncRS_ExportType (Name,IsActive) VALUES (N'Word', 1)
;
INSERT into SyncRS_ExportType (Name,IsActive) VALUES (N'Image', 1)
;
INSERT into SyncRS_ExportType (Name,IsActive) VALUES (N'PPT', 1)
;
INSERT into SyncRS_ExportType (Name,IsActive) VALUES (N'CSV', 1)
;

INSERT into SyncRS_RecurrenceType (Name,IsActive) VALUES (N'Daily', 1)
;
INSERT into SyncRS_RecurrenceType (Name,IsActive) VALUES (N'DailyWeekDay', 1)
;
INSERT into SyncRS_RecurrenceType (Name,IsActive) VALUES (N'Weekly', 1)
;
INSERT into SyncRS_RecurrenceType (Name,IsActive) VALUES (N'Monthly', 1)
;
INSERT into SyncRS_RecurrenceType (Name,IsActive) VALUES (N'MonthlyDOW', 1)
;
INSERT into SyncRS_RecurrenceType (Name,IsActive) VALUES (N'Yearly', 1)
;
INSERT into SyncRS_RecurrenceType (Name,IsActive) VALUES (N'YearlyDOW', 1)
;
INSERT into SyncRS_RecurrenceType (Name,IsActive) VALUES (N'Time', 1)
;
INSERT into SyncRS_RecurrenceType (Name,IsActive) VALUES ( N'Hourly',1)
;

INSERT into SyncRS_ScheduleStatus (Name,IsActive) VALUES (N'Success', 1)
;
INSERT into SyncRS_ScheduleStatus (Name,IsActive) VALUES (N'Failure', 1)
;

INSERT into SyncRS_PermissionEntity (Name,EntityType,ItemtypeId, IsActive) VALUES (N'All Reports',1,3,1)
;
INSERT into SyncRS_PermissionEntity (Name,EntityType,ItemtypeId, IsActive) VALUES (N'Reports in Category',2,1,1)
;
INSERT into SyncRS_PermissionEntity (Name,EntityType,ItemtypeId, IsActive) VALUES (N'Specific Report',0,3,1)
;
INSERT into SyncRS_PermissionEntity (Name,EntityType,ItemtypeId, IsActive) VALUES (N'All Categories',1,1,1)
;
INSERT into SyncRS_PermissionEntity (Name,EntityType,ItemtypeId, IsActive) VALUES (N'Specific Category',0,1,1)
;
INSERT into SyncRS_PermissionEntity (Name,EntityType,ItemtypeId, IsActive) VALUES (N'All Data Sources',1,4,1)
;
INSERT into SyncRS_PermissionEntity (Name,EntityType,ItemtypeId, IsActive) VALUES (N'Specific Data Source',0,4,1)
;
INSERT into SyncRS_PermissionEntity (Name,EntityType,ItemtypeId, IsActive) VALUES (N'All Files',1,6,1)
;
INSERT into SyncRS_PermissionEntity (Name,EntityType,ItemtypeId, IsActive) VALUES (N'Specific File',0,6,1)
;
INSERT into SyncRS_PermissionEntity (Name,EntityType,ItemtypeId, IsActive) VALUES (N'All Schedules',1,7,1)
;
INSERT into SyncRS_PermissionEntity (Name,EntityType,ItemtypeId, IsActive) VALUES (N'Specific Schedule',0,7,1)
;
INSERT into SyncRS_PermissionEntity (Name,EntityType,ItemtypeId, IsActive) VALUES (N'All Dashboards',1,2,1)
;
INSERT into SyncRS_PermissionEntity (Name,EntityType,ItemtypeId, IsActive) VALUES (N'Dashboards in Category',2,1,1)
;
INSERT into SyncRS_PermissionEntity (Name,EntityType,ItemtypeId, IsActive) VALUES (N'Specific Dashboard',0,2,1)
;
insert into SyncRS_PermissionEntity (Name,EntityType,ItemtypeId, IsActive) values(N'All Widgets',1,8,1)
;
insert into SyncRS_PermissionEntity (Name,EntityType,ItemtypeId, IsActive) values(N'Specific Widget',0,8,1)
;
INSERT into SyncRS_PermissionEntity (Name,EntityType,ItemtypeId, IsActive) VALUES (N'All Datasets',1,5,1)
;
INSERT into SyncRS_PermissionEntity (Name,EntityType,ItemtypeId, IsActive) VALUES (N'Specific Dataset',0,5,1)
;
INSERT into SyncRS_PermissionEntity (Name,EntityType,ItemtypeId, IsActive) VALUES (N'Specific ItemView',0,9,1)
;
INSERT into SyncRS_PermissionEntity (Name,EntityType,ItemtypeId, IsActive) VALUES (N'All ItemViews',1,9,1)
;
INSERT into SyncRS_ItemCommentLogType (Name,IsActive) VALUES ( N'Added',1)
;
INSERT into SyncRS_ItemCommentLogType (Name,IsActive) VALUES ( N'Edited',1)
;
INSERT into SyncRS_ItemCommentLogType (Name,IsActive) VALUES ( N'Deleted',1)
;
INSERT into SyncRS_ItemCommentLogType (Name,IsActive) VALUES ( N'Upvoted',1)
;
INSERT into SyncRS_ItemCommentLogType (Name,IsActive) VALUES ( N'Downvoted',1)
;
INSERT into SyncRS_ItemCommentLogType (Name,IsActive) VALUES ( N'Replied',1)
;
INSERT into SyncRS_ItemCommentLogType (Name,IsActive) VALUES ( N'UserMention',1)
;
INSERT into SyncRS_UserType(Type) values(N'Server User')
;
INSERT into SyncRS_UserType(Type) values(N'Active Directory User')
;
INSERT into SyncRS_UserType(Type) values(N'Federation User')
;

CREATE TABLE SyncRS_DBCredential(
    Id SERIAL primary key NOT NULL,
    DatabaseType varchar(255) NOT NULL,
    ConnectionString varchar(4000) NOT NULL,
    Status varchar(255) NOT NULL,
    ActiveStatusValue varchar(255) NOT NULL,
    UserNameSchema varchar(255) NOT NULL,
    UserNameTable varchar(255) NOT NULL,
    UserNameColumn varchar(255) NOT NULL,
    FirstNameSchema varchar(255) NOT NULL,
    FirstNameTable varchar(255) NOT NULL,
    FirstNameColumn varchar(255) NOT NULL,
    LastNameSchema varchar(255) NOT NULL,
    LastNameTable varchar(255) NOT NULL,
    LastNameColumn varchar(255) NOT NULL,
    EmailSchema varchar(255) NOT NULL,
    EmailTable varchar(255) NOT NULL,
    EmailColumn varchar(255) NOT NULL,
    IsActiveSchema varchar(255) NOT NULL,
    IsActiveTable varchar(255) NOT NULL,
    IsActiveColumn varchar(255) NOT NULL,
    EmailRelationId int NULL,
    FirstNameRelationId int NULL,
    IsActiveRelationId int NULL,
    LastNameRelationId int NULL,
    IsActive smallint NOT NULL)
;


CREATE TABLE SyncRS_TableRelation(
    Id SERIAL primary key NOT NULL,
    LeftTable varchar(255) NOT NULL,
    LeftTableColumnName varchar(255) NOT NULL,	
    LeftTableCondition  varchar(255) NOT NULL,
    LeftTableName  varchar(255) NOT NULL,
    LeftTableSchema varchar(255) NOT NULL,
    Relationship varchar(255) NOT NULL,
    RightTable varchar(255) NOT NULL,
    RightTableColumnName varchar(255) NOT NULL,	
    RightTableCondition  varchar(255) NOT NULL,
    RightTableName  varchar(255) NOT NULL,
    RightTableSchema varchar(255) NOT NULL)
;

CREATE TABLE SyncRS_ScheduleParameter(
    Id SERIAL primary key NOT NULL,
    ScheduleId uuid NOT NULL,
    Parameter varchar(4000) NOT NULL,
    IsActive smallint NOT NULL)
;

ALTER TABLE SyncRS_ScheduleParameter ADD FOREIGN KEY(ScheduleId) REFERENCES SyncRS_Item (Id)
;

CREATE TABLE SyncRS_PermissionAccess(
	Id SERIAL PRIMARY KEY NOT NULL,
	Name varchar(100) NOT NULL UNIQUE,
	AccessId int NOT NULL,
	IsActive smallint NOT NULL )
;

CREATE TABLE SyncRS_PermissionAccEntity(
	Id SERIAL PRIMARY KEY NOT NULL,
	PermissionEntityId int NOT NULL,
	PermissionAccessId int NOT NULL,
	IsActive smallint NOT NULL )
;

ALTER TABLE SyncRS_PermissionAccEntity  ADD FOREIGN KEY(PermissionEntityId) REFERENCES SyncRS_PermissionEntity (Id)
;
ALTER TABLE SyncRS_PermissionAccEntity  ADD FOREIGN KEY(PermissionAccessId) REFERENCES SyncRS_PermissionAccess (Id)
;

INSERT into SyncRS_PermissionAccess (Name,AccessId,IsActive) VALUES ( N'Create',1,1)
;
INSERT into SyncRS_PermissionAccess (Name,AccessId,IsActive) VALUES ( N'Read',2,1)
;
INSERT into SyncRS_PermissionAccess (Name,AccessId,IsActive) VALUES ( N'Read, Write',6,1)
;
INSERT into SyncRS_PermissionAccess (Name,AccessId,IsActive) VALUES ( N'Read, Write, Delete',14,1)
;
INSERT into SyncRS_PermissionAccess (Name,AccessId,IsActive) VALUES ( N'Read, Download',18,1)
;
INSERT into SyncRS_PermissionAccess (Name,AccessId,IsActive) VALUES ( N'Read, Write, Download',22,1)
;
INSERT into SyncRS_PermissionAccess (Name,AccessId,IsActive) VALUES ( N'Read, Write, Delete, Download',30,1)
;

INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (4,1,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (6,1,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (10,1,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (1,1,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (2,1,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (17,1,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (8,1,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (1,2,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (2,2,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (3,2,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (4,2,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (5,2,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (10,2,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (11,2,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (4,3,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (5,3,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (10,3,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (11,3,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (4,4,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (5,4,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (10,4,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (11,4,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (1,5,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (2,5,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (3,5,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (17,5,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (18,5,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (6,5,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (7,5,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (8,5,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (9,5,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (1,6,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (2,6,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (3,6,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (17,6,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (18,6,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (6,6,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (7,6,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (8,6,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (9,6,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (1,7,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (2,7,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (3,7,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (6,7,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (7,7,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (17,7,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (18,7,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (8,7,1)
;
INSERT INTO SyncRS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (9,7,1)
;

CREATE TABLE SyncRS_UmsCredential(
	Id SERIAL PRIMARY KEY NOT NULL,
	UmsUrl varchar(255),
	ClientId varchar(255),
	ClientSecret varchar(255),
	IsActive smallint NOT NULL)
;

CREATE TABLE SyncRS_UmsGroup(
	Id SERIAL PRIMARY KEY NOT NULL,
	GroupId int NOT NULL,
	UmsGroupId int NOT NULL,
	IsActive smallint NOT NULL)
;

ALTER TABLE SyncRS_UmsGroup ADD FOREIGN KEY(GroupId) REFERENCES SyncRS_Group (Id)
;

CREATE TABLE SyncRS_UmsUser(
	Id SERIAL PRIMARY KEY NOT NULL,
	UserId int NOT NULL,
	UmsUserId int NOT NULL,
	IsActive smallint NOT NULL)
;

ALTER TABLE SyncRS_UmsUser ADD FOREIGN KEY(UserId) REFERENCES SyncRS_User (Id)
;
