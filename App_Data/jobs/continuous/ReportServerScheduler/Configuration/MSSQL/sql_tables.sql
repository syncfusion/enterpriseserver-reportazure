CREATE TABLE [SyncRS_User](
	[Id] [int] IDENTITY(1,1) primary key NOT NULL,
	[UserName] [nvarchar](100) NOT NULL,
	[FirstName] [nvarchar](255) NOT NULL,
	[LastName] [nvarchar](255) NULL,
	[DisplayName] [nvarchar](512) NULL,
	[Email] [nvarchar](255) NOT NULL,
	[Password] [nvarchar](255) NOT NULL,
	[Contact] [nvarchar](20) NULL,
	[Picture] [nvarchar](100) NOT NULL,	
	[CreatedDate] [datetime] NOT NULL,
	[ModifiedDate] [datetime] NULL,
	[LastLogin] [datetime] NULL,
	[PasswordChangedDate] [datetime] NULL,
	[ActivationExpirationDate] [datetime] NULL,
	[ActivationCode] [nvarchar](255) NOT NULL,
	[ResetPasswordCode] [nvarchar](255) NULL,
	[LastResetAttempt] [datetime] NULL,
	[UserTypeId] [int] NOT NULL DEFAULT 0,
	[IsActivated] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL,
	[IsDeleted] [bit] NOT NULL)
;

CREATE TABLE [SyncRS_Group](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[Name] [nvarchar](255) NOT NULL,
	[Description] [nvarchar](1026) NULL,
	[Color] [nvarchar](255) NOT NULL DEFAULT 'White',
	[ModifiedDate] [datetime] NOT NULL,
	[IsActive] [bit] NOT NULL)
;

CREATE TABLE [SyncRS_UserGroup](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[GroupId] [int] NOT NULL,
	[UserId] [int] NOT NULL,
	[ModifiedDate] [datetime] NOT NULL,
	[IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncRS_UserGroup]  ADD FOREIGN KEY([GroupId]) REFERENCES [SyncRS_Group] ([Id])
;
ALTER TABLE [SyncRS_UserGroup]  ADD FOREIGN KEY([UserId]) REFERENCES [SyncRS_User] ([Id])
;

CREATE TABLE [SyncRS_UserLogType](
	[Id] [int] IDENTITY(1,1) primary key NOT NULL,
	[Name] [nvarchar](100) NOT NULL UNIQUE,
	[IsActive] [bit] NOT NULL)
;

CREATE TABLE [SyncRS_UserLog](
	[Id] [int] IDENTITY(1,1) primary key NOT NULL,
	[UserLogTypeId] [int] NOT NULL,	
	[GroupId] [int] NULL,
	[OldValue] [int] NULL,
	[NewValue] [int] NULL,
	[UpdatedUserId] [int] NOT NULL,
	[TargetUserId] [int] NOT NULL,
	[ModifiedDate] [datetime] NOT NULL,
	[IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncRS_UserLog]  ADD  FOREIGN KEY([UserLogTypeId]) REFERENCES [SyncRS_UserLogType] ([Id])
;
ALTER TABLE [SyncRS_UserLog]  ADD  FOREIGN KEY([GroupId]) REFERENCES [SyncRS_Group] ([Id])
;
ALTER TABLE [SyncRS_UserLog]  ADD  FOREIGN KEY([TargetUserId]) REFERENCES [SyncRS_User] ([Id])
;
ALTER TABLE [SyncRS_UserLog]  ADD  FOREIGN KEY([UpdatedUserId]) REFERENCES [SyncRS_User] ([Id])
;

CREATE TABLE [SyncRS_UserLogin](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[UserId] [int] NOT NULL,
	[ClientToken] [nvarchar](4000) NOT NULL,
	[IpAddress] [nvarchar](50) NOT NULL,
	[LoggedInTime] [datetime] NOT NULL,
	[IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncRS_UserLogin]  ADD FOREIGN KEY([UserId]) REFERENCES [SyncRS_User] ([Id])
;

CREATE TABLE [SyncRS_UserPreference](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[UserId] [int] NOT NULL,
	[Language] [nvarchar](4000) NULL,
	[TimeZone] [nvarchar](100) NULL,
	[RecordSize] [int] NULL,
	[ItemSort] [nvarchar](4000) NULL,
	[ItemFilters] [nvarchar](4000) NULL,
	[Notifications] [nvarchar](4000) NULL,
	[ModifiedDate] [datetime] NOT NULL,
	[IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncRS_UserPreference] ADD FOREIGN KEY([UserId]) REFERENCES [SyncRS_User] ([Id])
;

CREATE TABLE [SyncRS_SystemLogType](
	[Id] [int] IDENTITY(1,1) primary key NOT NULL,
	[Name] [nvarchar](100) NOT NULL UNIQUE,
	[IsActive] [bit] NOT NULL)
;

CREATE TABLE [SyncRS_SystemLog](
	[LogId] [int] IDENTITY(1,1) primary key NOT NULL,
	[SystemLogTypeId] [int] NOT NULL,
	[UpdatedUserId] [int] NOT NULL,
	[TargetUserId] [int] NOT NULL,		
	[ModifiedDate] [datetime] NOT NULL,
	[IsActive] bit NOT NULL)
;

ALTER TABLE [SyncRS_SystemLog]  ADD FOREIGN KEY([SystemLogTypeId]) REFERENCES [SyncRS_SystemLogType] ([Id])
;
ALTER TABLE [SyncRS_SystemLog]  ADD FOREIGN KEY([UpdatedUserId]) REFERENCES [SyncRS_User] ([Id])
;
ALTER TABLE [SyncRS_SystemLog]  ADD FOREIGN KEY([TargetUserId]) REFERENCES [SyncRS_User] ([Id])
;

CREATE TABLE [SyncRS_ItemType](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[Name] [nvarchar](100) NOT NULL UNIQUE,
	[IsActive] [bit] NULL)
;

CREATE TABLE [SyncRS_Item](
	[Id] [uniqueidentifier] PRIMARY KEY NOT NULL,
	[Name] [nvarchar](255) NOT NULL,
	[Description] [nvarchar](1026) NULL,
	[ItemTypeId] [int] NOT NULL,
	[ParentId] [uniqueidentifier] NULL,
	[Extension] [nvarchar](30) NULL,
	[CloneItemId] [uniqueidentifier] NULL,
	[CreatedById] [int] NOT NULL,
	[ModifiedById] [int] NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[ModifiedDate] [datetime] NOT NULL,
	[IsPublic] [bit] NOT NULL DEFAULT 0,
	[IsActive] [bit] NULL,
	[IsWebDesignerCompatible] [bit] NOT NULL DEFAULT 0)
;

ALTER TABLE [SyncRS_Item]  ADD FOREIGN KEY([ItemTypeId]) REFERENCES [SyncRS_ItemType] ([Id])
;
ALTER TABLE [SyncRS_Item]  ADD FOREIGN KEY([ParentId]) REFERENCES [SyncRS_Item] ([Id])
;
ALTER TABLE [SyncRS_Item]  ADD FOREIGN KEY([CreatedById]) REFERENCES [SyncRS_User] ([Id])
;
ALTER TABLE [SyncRS_Item]  ADD FOREIGN KEY([ModifiedById]) REFERENCES [SyncRS_User] ([Id])
;

CREATE TABLE [SyncRS_ItemView](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[ItemId] [uniqueidentifier] NOT NULL,
	[UserId] [int] NOT NULL,
	[ItemViewId] [uniqueidentifier] NOT NULL,
	[QueryString] [nvarchar](4000) NOT NULL,
	[ModifiedDate] [datetime] NOT NULL,
	[IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncRS_ItemView]  ADD FOREIGN KEY([ItemId]) REFERENCES [SyncRS_Item] ([Id])
;
ALTER TABLE [SyncRS_ItemView]  ADD FOREIGN KEY([ItemViewId]) REFERENCES [SyncRS_Item] ([Id])
;
ALTER TABLE [SyncRS_ItemView]  ADD FOREIGN KEY([UserId]) REFERENCES [SyncRS_User] ([Id])
;

CREATE TABLE [SyncRS_ProcessOption](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[ItemId] [uniqueidentifier] NOT NULL,
	[ProcessOption] [nvarchar](4000) NULL,
	[NextScheduleDate] [DateTime] NULL,
	[CreatedDate] [DateTime] NOT NULL,
	[ModifiedDate] [DateTime] NOT NULL,
	[IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncRS_ProcessOption]  ADD FOREIGN KEY([ItemId]) REFERENCES [SyncRS_Item] ([Id])
;

CREATE TABLE [SyncRS_ProcessOptionMap](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[ProcessOptionId] [int] NOT NULL,
	[ItemId] [uniqueidentifier] NOT NULL,
	[IsActive] [bit] NOT NULL)
;
ALTER TABLE [SyncRS_ProcessOptionMap]  ADD FOREIGN KEY([ProcessOptionId]) REFERENCES [SyncRS_ProcessOption] ([Id])
;
ALTER TABLE [SyncRS_ProcessOptionMap]  ADD FOREIGN KEY([ItemId]) REFERENCES [SyncRS_Item] ([Id])
;

CREATE TABLE [SyncRS_ItemLogType](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[Name] [nvarchar](100) NULL UNIQUE,
	[IsActive] [bit] NULL)
;


CREATE TABLE [SyncRS_ItemTrash](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[ItemId] [uniqueidentifier] NOT NULL,
	[TrashedById] [int] NOT NULL,
	[TrashedDate] [datetime] NOT NULL,
	[IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncRS_ItemTrash]  ADD FOREIGN KEY([ItemId]) REFERENCES [SyncRS_Item] ([Id])
;
ALTER TABLE [SyncRS_ItemTrash]  ADD FOREIGN KEY([TrashedById]) REFERENCES [SyncRS_User] ([Id])
;

CREATE TABLE [SyncRS_ItemTrashDeleted](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[ItemId] [uniqueidentifier] NOT NULL,
	[ItemTrashId] [int] NOT NULL,
	[DeletedById] [int] NOT NULL,
	[DeletedDate] [datetime] NOT NULL,
	[IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncRS_ItemTrashDeleted]  ADD FOREIGN KEY([ItemId]) REFERENCES [SyncRS_Item] ([Id])
;
ALTER TABLE [SyncRS_ItemTrashDeleted]  ADD FOREIGN KEY([ItemTrashId]) REFERENCES [SyncRS_ItemTrash] ([Id])
;
ALTER TABLE [SyncRS_ItemTrashDeleted]  ADD FOREIGN KEY([DeletedById]) REFERENCES [SyncRS_User] ([Id])
;

CREATE TABLE [SyncRS_ItemVersion](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[ItemId] [uniqueidentifier] NOT NULL,
	[ItemTypeId] [int] NOT NULL,
	[ItemName] [nvarchar](265) NULL,
	[VersionNumber] [int] NOT NULL,
	[RolledbackVersionNumber] [int] NULL,
	[Comment] [nvarchar](1026) NULL,
	[IsCurrentVersion] [bit] NOT NULL,
	[CreatedById] [int] NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncRS_ItemVersion]  ADD FOREIGN KEY([ItemTypeId]) REFERENCES [SyncRS_ItemType] ([Id])
;
ALTER TABLE [SyncRS_ItemVersion]  ADD FOREIGN KEY([ItemId]) REFERENCES [SyncRS_Item] ([Id])
;
ALTER TABLE [SyncRS_ItemVersion]  ADD FOREIGN KEY([CreatedById]) REFERENCES [SyncRS_User] ([Id])
;

CREATE TABLE [SyncRS_ItemLog](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[ItemLogTypeId] [int] NOT NULL,
	[ItemId] [uniqueidentifier] NOT NULL,
	[ItemVersionId] [int] NOT NULL,
	[ParentId] [uniqueidentifier] NULL,
	[FromCategoryId] [uniqueidentifier] NULL,
	[ToCategoryId] [uniqueidentifier] NULL,
	[UpdatedUserId] [int] NOT NULL,	
	[ModifiedDate] [datetime] NOT NULL,
	[IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncRS_ItemLog]  ADD FOREIGN KEY([ItemVersionId]) REFERENCES [SyncRS_ItemVersion] ([Id])
;
ALTER TABLE [SyncRS_ItemLog]  ADD FOREIGN KEY([ItemLogTypeId]) REFERENCES [SyncRS_ItemLogType] ([Id])
;
ALTER TABLE [SyncRS_ItemLog]  ADD FOREIGN KEY([ItemId]) REFERENCES [SyncRS_Item] ([Id])
;
ALTER TABLE [SyncRS_ItemLog]  ADD FOREIGN KEY([ParentId]) REFERENCES [SyncRS_Item] ([Id])
;
ALTER TABLE [SyncRS_ItemLog]  ADD FOREIGN KEY([FromCategoryId]) REFERENCES [SyncRS_Item] ([Id])
;
ALTER TABLE [SyncRS_ItemLog]  ADD FOREIGN KEY([ToCategoryId]) REFERENCES [SyncRS_Item] ([Id])
;
ALTER TABLE [SyncRS_ItemLog]  ADD FOREIGN KEY([UpdatedUserId]) REFERENCES [SyncRS_User] ([Id])
;


CREATE TABLE [SyncRS_PermissionEntity](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[Name] [nvarchar](100) NOT NULL UNIQUE,
	[EntityType] [int] NOT NULL,
	[ItemTypeId] [int] NOT NULL,
	[IsActive] [bit] NOT NULL)
;
ALTER TABLE [SyncRS_PermissionEntity]  ADD FOREIGN KEY([ItemTypeId]) REFERENCES [SyncRS_ItemType] ([Id])
;

CREATE TABLE [SyncRS_UserPermission](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[PermissionAccessId] [int] NOT NULL,
	[PermissionEntityId] [int] NOT NULL,
	[ItemId] [uniqueidentifier] NULL,
	[UserId] [int] NOT NULL,
	[IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncRS_UserPermission]  ADD  FOREIGN KEY([PermissionEntityId]) REFERENCES [SyncRS_PermissionEntity] ([Id])
;
ALTER TABLE [SyncRS_UserPermission]  ADD  FOREIGN KEY([ItemId]) REFERENCES [SyncRS_Item] ([Id])
;
ALTER TABLE [SyncRS_UserPermission]  ADD  FOREIGN KEY([UserId]) REFERENCES [SyncRS_User] ([Id])
;

CREATE TABLE [SyncRS_GroupPermission](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[PermissionAccessId] [int] NOT NULL,
	[PermissionEntityId] [int] NOT NULL,
	[ItemId] [uniqueidentifier] NULL,
	[GroupId] [int] NOT NULL,
	[IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncRS_GroupPermission]  ADD  FOREIGN KEY([PermissionEntityId]) REFERENCES [SyncRS_PermissionEntity] ([Id])
;
ALTER TABLE [SyncRS_GroupPermission]  ADD  FOREIGN KEY([ItemId]) REFERENCES [SyncRS_Item] ([Id])
;
ALTER TABLE [SyncRS_GroupPermission]  ADD  FOREIGN KEY([GroupId]) REFERENCES [SyncRS_Group] ([Id])
;

CREATE TABLE [SyncRS_RecurrenceType](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[Name] [nvarchar](30) NOT NULL UNIQUE,
	[IsActive] [bit] NOT NULL)
;

CREATE TABLE [SyncRS_ExportType](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[Name] [nvarchar](20) NOT NULL UNIQUE,
	[IsActive] [bit] NOT NULL)
;

CREATE TABLE [SyncRS_ScheduleDetail](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[ScheduleId] [uniqueidentifier] NOT NULL,
	[ItemId] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](150) NOT NULL,
	[RecurrenceTypeId] [int] NOT NULL,
	[RecurrenceInfo] [nvarchar](4000) NOT NULL,
	[ExportFileSettingsInfo] [nvarchar](4000) NULL,
	[StartDate] [datetime] NOT NULL,
	[EndDate] [datetime] NULL,
	[EndAfter] [int] NOT NULL DEFAULT 0,
	[NextSchedule] [datetime],
	[ExportTypeId] [int] NOT NULL,
	[IsEnabled] [bit] NOT NULL,
	[IsParameterEnabled] [bit] NOT NULL,
	[CreatedById] [int] NOT NULL,
	[ModifiedById] [int] NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[ModifiedDate] [datetime] NOT NULL,
	[IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncRS_ScheduleDetail]  ADD FOREIGN KEY([ScheduleId]) REFERENCES [SyncRS_Item] ([Id])
;
ALTER TABLE [SyncRS_ScheduleDetail]  ADD FOREIGN KEY([ItemId]) REFERENCES [SyncRS_Item] ([Id])
;
ALTER TABLE [SyncRS_ScheduleDetail]  ADD FOREIGN KEY([RecurrenceTypeId]) REFERENCES [SyncRS_RecurrenceType] ([Id])
;
ALTER TABLE [SyncRS_ScheduleDetail]  ADD FOREIGN KEY([ExportTypeId]) REFERENCES [SyncRS_ExportType] ([Id])
;
ALTER TABLE [SyncRS_ScheduleDetail]  ADD FOREIGN KEY([CreatedById]) REFERENCES [SyncRS_User] ([Id])
;
ALTER TABLE [SyncRS_ScheduleDetail]  ADD FOREIGN KEY([ModifiedById]) REFERENCES [SyncRS_User] ([Id])
;

CREATE TABLE [SyncRS_SubscribedUser](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[ScheduleId] [uniqueidentifier] NOT NULL,
	[SubscribedById] [int] NOT NULL,
	[RecipientUserId] [int] NOT NULL,
	[SubscribedDate] [datetime] NOT NULL,
	[ModifiedDate] [datetime] NOT NULL,
	[IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncRS_SubscribedUser]  ADD FOREIGN KEY([ScheduleId]) REFERENCES [SyncRS_Item] ([Id])
;
ALTER TABLE [SyncRS_SubscribedUser]  ADD FOREIGN KEY([SubscribedById]) REFERENCES [SyncRS_User] ([Id])
;
ALTER TABLE [SyncRS_SubscribedUser]  ADD FOREIGN KEY([RecipientUserId]) REFERENCES [SyncRS_User] ([Id])
;

CREATE TABLE [SyncRS_SubscribedGroup](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[ScheduleId] [uniqueidentifier] NOT NULL,
	[SubscribedById] [int] NOT NULL,
	[RecipientGroupId] [int] NOT NULL,
	[SubscribedDate] [datetime] NOT NULL,
	[ModifiedDate] [datetime] NOT NULL,
	[IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncRS_SubscribedGroup]  ADD FOREIGN KEY([ScheduleId]) REFERENCES [SyncRS_Item] ([Id])
;
ALTER TABLE [SyncRS_SubscribedGroup]  ADD FOREIGN KEY([SubscribedById]) REFERENCES [SyncRS_User] ([Id])
;
ALTER TABLE [SyncRS_SubscribedGroup]  ADD FOREIGN KEY([RecipientGroupId]) REFERENCES [SyncRS_Group] ([Id])
;

CREATE TABLE [SyncRS_SubscrExtnRecpt](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[ScheduleId] [uniqueidentifier] NOT NULL,
	[SubscribedById] [int] NOT NULL,
	[EmailIds] [NVARCHAR](4000) NOT NULL,
	[SubscribedDate] [datetime] NOT NULL,
	[ModifiedDate] [datetime] NOT NULL,
	[IsActive] [bit] NOT NULL);
	
ALTER TABLE [SyncRS_SubscrExtnRecpt]  ADD FOREIGN KEY([ScheduleId]) REFERENCES [SyncRS_Item] ([Id])
;
ALTER TABLE [SyncRS_SubscrExtnRecpt]  ADD FOREIGN KEY([SubscribedById]) REFERENCES [SyncRS_User] ([Id])
;

CREATE TABLE [SyncRS_ScheduleStatus](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[IsActive] [bit] NOT NULL)
;

CREATE TABLE [SyncRS_ScheduleLogUser](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[ScheduleId] [uniqueidentifier] NOT NULL,
	[ScheduleStatusId] [int] NOT NULL,
	[DeliveredUserId] [int] NOT NULL,
	[DeliveredDate] [datetime] NOT NULL,
	[IsOnDemand] [bit] NOT NULL,	
	[IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncRS_ScheduleLogUser]  ADD FOREIGN KEY([ScheduleStatusId]) REFERENCES [SyncRS_ScheduleStatus] ([Id])
;
ALTER TABLE [SyncRS_ScheduleLogUser]  ADD FOREIGN KEY([ScheduleId]) REFERENCES [SyncRS_Item] ([Id])
;
ALTER TABLE [SyncRS_ScheduleLogUser]  ADD FOREIGN KEY([DeliveredUserId]) REFERENCES [SyncRS_User] ([Id])
;

CREATE TABLE [SyncRS_ScheduleLogGroup](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[ScheduleId] [uniqueidentifier] NOT NULL,
	[ScheduleStatusId] [int] NOT NULL,
	[GroupId] [int] NOT NULL,
	[DeliveredUserId] [int] NOT NULL,
	[DeliveredDate] [datetime] NOT NULL,
	[IsOnDemand] [bit] NOT NULL,
	[IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncRS_ScheduleLogGroup]  ADD FOREIGN KEY([ScheduleStatusId]) REFERENCES [SyncRS_ScheduleStatus] ([Id])
;
ALTER TABLE [SyncRS_ScheduleLogGroup]  ADD FOREIGN KEY([ScheduleId]) REFERENCES [SyncRS_Item] ([Id])
;
ALTER TABLE [SyncRS_ScheduleLogGroup]  ADD FOREIGN KEY([GroupId]) REFERENCES [SyncRS_Group] ([Id])
;
ALTER TABLE [SyncRS_ScheduleLogGroup]  ADD FOREIGN KEY([DeliveredUserId]) REFERENCES [SyncRS_User] ([Id])
;

CREATE TABLE [SyncRS_SchdLogExtnRecpt](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[ScheduleId] [uniqueidentifier] NOT NULL,
	[ScheduleStatusId] [int] NOT NULL,
	[DeliveredEmailId] [NVARCHAR](150) NOT NULL,
	[DeliveredDate] [datetime] NOT NULL,
	[IsOnDemand] [bit] NOT NULL,	
	[IsActive] [bit] NOT NULL);
	
ALTER TABLE [SyncRS_SchdLogExtnRecpt]  ADD FOREIGN KEY([ScheduleStatusId]) REFERENCES [SyncRS_ScheduleStatus] ([Id])
;
ALTER TABLE [SyncRS_SchdLogExtnRecpt]  ADD FOREIGN KEY([ScheduleId]) REFERENCES [SyncRS_Item] ([Id])
;

CREATE TABLE [SyncRS_ReportDataSource](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[ReportItemId] [uniqueidentifier] NOT NULL,
	[DataSourceItemId] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](255) NOT NULL,
	[ModifiedDate] [datetime] NOT NULL,
	[IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncRS_ReportDataSource]  ADD FOREIGN KEY([ReportItemId]) REFERENCES [SyncRS_Item] ([Id])
;
ALTER TABLE [SyncRS_ReportDataSource]  ADD FOREIGN KEY([DataSourceItemId]) REFERENCES [SyncRS_Item] ([Id])
;

CREATE TABLE [SyncRS_ScheduleLog](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[ScheduleStatusId] [int] NOT NULL,
	[ScheduleId] [uniqueidentifier] NOT NULL,
	[ExecutedDate] [datetime] NOT NULL,
	[ModifiedDate] [datetime] NOT NULL,
	[IsOnDemand] [bit] NOT NULL DEFAULT (0),
	[IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncRS_ScheduleLog]  ADD FOREIGN KEY([ScheduleStatusId]) REFERENCES [SyncRS_ScheduleStatus] ([Id])
;
ALTER TABLE [SyncRS_ScheduleLog]  ADD FOREIGN KEY([ScheduleId]) REFERENCES [SyncRS_Item] ([Id])
;

CREATE TABLE [SyncRS_SystemSettings](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[Key] [nvarchar](255) NOT NULL,
	[Value] [nvarchar](4000) NULL,
	[ModifiedDate] [datetime] NOT NULL,
	[IsActive] [bit] NOT NULL,
	CONSTRAINT UK_SyncRS_SystemSettings_Key UNIQUE([Key]))
;

CREATE TABLE [SyncRS_DataSourceDetail](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[DataSourceId] [uniqueidentifier] NOT NULL,
	[Password] [nvarchar](255) NOT NULL,
	[ModifiedDate] [datetime] NOT NULL,
	[IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncRS_DataSourceDetail] ADD FOREIGN KEY([DataSourceId]) REFERENCES [SyncRS_Item] ([Id])
;

CREATE TABLE [SyncRS_ServerVersion](
[Id] [int] PRIMARY KEY NOT NULL,
[VersionNumber] [nvarchar](20) NOT NULL)
;

CREATE TABLE [SyncRS_ADUser](
[Id] [int] IDENTITY(1,1) primary key NOT NULL,
[UserId] [int] NOT NULL,
[ActiveDirectoryUserId] [uniqueidentifier] NOT NULL,
[IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncRS_ADUser] ADD FOREIGN KEY([UserId]) REFERENCES [SyncRS_User] ([Id])
;

CREATE TABLE [SyncRS_ADGroup](
[Id] [int] IDENTITY(1,1) primary key NOT NULL,
[GroupId] [int] NOT NULL,
[ActiveDirectoryGroupId] [uniqueidentifier] NOT NULL,
[IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncRS_ADGroup] ADD FOREIGN KEY([GroupId]) REFERENCES [SyncRS_Group] ([Id])
;

CREATE TABLE [SyncRS_ADCredential](
[Id] [int] IDENTITY(1,1) primary key NOT NULL,
[Username] [nvarchar](100),
[Password] [nvarchar](100),
[LdapUrl] [nvarchar](255),
[EnableSsl] [bit] NOT NULL,
[DistinguishedName] [nvarchar](150),
[PortNo] [int] NOT NULL,
[IsActive] [bit] NOT NULL)
;

CREATE TABLE [SyncRS_DatasetLinkage](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[DatasetItemId] [uniqueidentifier] NOT NULL,
	[ItemId] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](255) NOT NULL,
	[ModifiedDate] [datetime] NOT NULL,
	[IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncRS_DatasetLinkage]  ADD FOREIGN KEY([DatasetItemId]) REFERENCES [SyncRS_Item] ([Id])
;
ALTER TABLE [SyncRS_DatasetLinkage]  ADD FOREIGN KEY([ItemId]) REFERENCES [SyncRS_Item] ([Id])
;

CREATE TABLE [SyncRS_FavoriteItem](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[UserId] [int] NOT NULL,
	[ItemId] [uniqueidentifier] NOT NULL,
	[IsActive] [bit] NOT NULL)
;
	
ALTER TABLE [SyncRS_FavoriteItem]  ADD FOREIGN KEY([UserId]) REFERENCES [SyncRS_User] ([Id])
;
ALTER TABLE [SyncRS_FavoriteItem]  ADD FOREIGN KEY([ItemId]) REFERENCES [SyncRS_Item] ([Id])
;


CREATE TABLE [SyncRS_Comment](
    [Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
    [Comment] [NVARCHAR](4000) NOT NULL,
    [ItemId] [uniqueidentifier] NOT NULL,
    [UserId] [int] NOT NULL,
    [ParentId] [int] NULL,
    [CreatedDate] [datetime] NOT NULL,
    [ModifiedDate] [datetime] NOT NULL,
    [ModifiedById] [int] NOT NULL,
    [IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncRS_Comment] ADD FOREIGN KEY([ItemId]) REFERENCES [SyncRS_Item] ([Id])
;
ALTER TABLE [SyncRS_Comment] ADD FOREIGN KEY([UserId]) REFERENCES [SyncRS_User] ([Id])
;
ALTER TABLE [SyncRS_Comment] ADD FOREIGN KEY([ModifiedById]) REFERENCES [SyncRS_User] ([Id])
; 

CREATE TABLE [SyncRS_ItemWatch](
            [Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
            [ItemId] [uniqueidentifier] NOT NULL,
            [UserId] [int] NOT NULL,
            [ModifiedDate] [datetime] NOT NULL,
			[IsWatched] [bit] NOT NULL,
            [IsActive] [bit] NOT NULL)
;
 
ALTER TABLE [SyncRS_ItemWatch] ADD FOREIGN KEY([ItemId]) REFERENCES [SyncRS_Item] ([Id])
;
ALTER TABLE [SyncRS_ItemWatch] ADD FOREIGN KEY([UserId]) REFERENCES [SyncRS_User] ([Id])
;  

CREATE TABLE [SyncRS_ItemCommentLogType](
    [Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
    [Name] [nvarchar](100) NULL UNIQUE,
    [IsActive] [bit] NULL)
;

CREATE TABLE [SyncRS_ItemCommentLog](
    [Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
    [ItemCommentLogTypeId] [int] NOT NULL,
    [CurrentUserId] [int] NOT NULL,    
    [CommentId] [int] NOT NULL,
	[Url] nvarchar(4000) NOT NULL,
    [ClubId] nvarchar(100) NOT NULL,
    [RepliedFor] [int] NULL,
    [OldValue] nvarchar(4000) NULL,
    [NewValue] nvarchar(4000) NULL,
    [NotificationTo] [int] NULL,    
    [ModifiedDate] [datetime] NOT NULL,
    [IsRead] [bit] NOT NULL,
    [IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncRS_ItemCommentLog]  ADD FOREIGN KEY([CurrentUserId]) REFERENCES [SyncRS_User] ([Id])
;
ALTER TABLE [SyncRS_ItemCommentLog]  ADD FOREIGN KEY([ItemCommentLogTypeId]) REFERENCES [SyncRS_ItemCommentLogType] ([Id])
;
ALTER TABLE [SyncRS_ItemCommentLog]  ADD FOREIGN KEY([CommentId]) REFERENCES [SyncRS_Comment] ([Id])
;
ALTER TABLE [SyncRS_ItemCommentLog]  ADD FOREIGN KEY([RepliedFor]) REFERENCES [SyncRS_Comment] ([Id])
;
ALTER TABLE [SyncRS_ItemCommentLog]  ADD FOREIGN KEY([NotificationTo]) REFERENCES [SyncRS_User] ([Id])
;

CREATE TABLE [SyncRS_AzureADCredential](
[Id] [int] IDENTITY(1,1) primary key NOT NULL,
[TenantName] [nvarchar](255),
[ClientId] [nvarchar](100),
[ClientSecret] [nvarchar](100),
[IsActive] [bit] NOT NULL)
;

CREATE TABLE [SyncRS_AzureADUser](
[Id] [int] IDENTITY(1,1) primary key NOT NULL,
[UserId] [int] NOT NULL,
[AzureADUserId] [uniqueidentifier] NOT NULL,
[IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncRS_AzureADUser] ADD FOREIGN KEY([UserId]) REFERENCES [SyncRS_User] ([Id])
;

CREATE TABLE [SyncRS_AzureADGroup](
[Id] [int] IDENTITY(1,1) primary key NOT NULL,
[GroupId] [int] NOT NULL,
[AzureADGroupId] [uniqueidentifier] NOT NULL,
[IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncRS_AzureADGroup] ADD FOREIGN KEY([GroupId]) REFERENCES [SyncRS_Group] ([Id])
;


CREATE TABLE [SyncRS_SAMLSettings](
	[Id] [int] IDENTITY(1,1) primary key NOT NULL, 
	[MetadataURI] nvarchar(4000),
	[Authority] nvarchar(4000),
	[DesignerClientId] nvarchar(100),
	[TenantName] nvarchar(100), 
	[MobileAppId] nvarchar(100),
	[IsEnabled] bit NOT NULL)
;

CREATE TABLE [SyncRS_UserType](
	[Id] [int] IDENTITY(1,1) primary key NOT NULL, 
	[Type] nvarchar(100) UNIQUE)
;

CREATE TABLE [SyncRS_DBCredential](
    [Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
    [DatabaseType] [nvarchar](255) NOT NULL,
    [ConnectionString] [nvarchar](4000) NOT NULL,
    [UserNameSchema] [nvarchar](255) NOT NULL,
    [UserNameTable] [nvarchar](255) NOT NULL,
    [UserNameColumn] [nvarchar](255) NOT NULL,
    [FirstNameSchema] [nvarchar](255) NOT NULL,
    [FirstNameTable] [nvarchar](255) NOT NULL,
    [FirstNameColumn] [nvarchar](255) NOT NULL,
    [LastNameSchema] [nvarchar](255) NOT NULL,
    [LastNameTable] [nvarchar](255) NOT NULL,
    [LastNameColumn] [nvarchar](255) NOT NULL,
    [EmailSchema] [nvarchar](255) NOT NULL,
    [EmailTable] [nvarchar](255) NOT NULL,
    [EmailColumn] [nvarchar](255) NOT NULL,
    [IsActiveSchema] [nvarchar](255) NOT NULL,
    [IsActiveTable] [nvarchar](255) NOT NULL,
    [IsActiveColumn] [nvarchar](255) NOT NULL,
    [Status]  [nvarchar](255) NOT NULL,
    [ActiveStatusValue]  [nvarchar](255) NOT NULL,
    [EmailRelationId] [int] NULL,
    [FirstNameRelationId] [int] NULL,
    [LastNameRelationId] [int] NULL,
    [IsActiveRelationId] [int] NULL,
    [IsActive] [bit] NOT NULL)
;

CREATE TABLE [SyncRS_TableRelation](
    [Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
    [LeftTable] [nvarchar](255) NOT NULL,
    [LeftTableColumnName] [nvarchar](255) NOT NULL,	
    [LeftTableCondition]  [nvarchar](255) NOT NULL,
    [LeftTableName]  [nvarchar](255) NOT NULL,
    [LeftTableSchema] [nvarchar](255) NOT NULL,
    [Relationship] [nvarchar](255) NOT NULL,
    [RightTable] [nvarchar](255) NOT NULL,
    [RightTableColumnName] [nvarchar](255) NOT NULL,	
    [RightTableCondition]  [nvarchar](255) NOT NULL,
    [RightTableName]  [nvarchar](255) NOT NULL,
    [RightTableSchema] [nvarchar](255) NOT NULL)
;

CREATE TABLE [SyncRS_ScheduleParameter](
    [Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
    [ScheduleId] [uniqueidentifier] NOT NULL,
    [Parameter] nvarchar(4000) NOT NULL,
    [IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncRS_ScheduleParameter] ADD FOREIGN KEY([ScheduleId]) REFERENCES [SyncRS_Item] ([Id])
;

INSERT into [SyncRS_ItemType] (Name,IsActive) VALUES (N'Category',1)
;
INSERT into [SyncRS_ItemType] (Name,IsActive) VALUES (N'Dashboard',1)
;
INSERT into [SyncRS_ItemType] (Name,IsActive) VALUES (N'Report',1)
;
INSERT into [SyncRS_ItemType] (Name,IsActive) VALUES (N'Datasource',1)
;
INSERT into [SyncRS_ItemType] (Name,IsActive) VALUES (N'Dataset',1)
;
INSERT into [SyncRS_ItemType] (Name,IsActive) VALUES (N'File',1)
;
INSERT into [SyncRS_ItemType] (Name,IsActive) VALUES (N'Schedule',1)
;
insert into [SyncRS_ItemType] (Name,IsActive) values (N'Widget',1)
;
insert into [SyncRS_ItemType] (Name,IsActive) values (N'ItemView',1)
;


INSERT into [SyncRS_ItemLogType] (Name,IsActive) VALUES ( N'Added',1)
;
INSERT into [SyncRS_ItemLogType] (Name,IsActive) VALUES ( N'Edited',1)
;
INSERT into [SyncRS_ItemLogType] (Name,IsActive) VALUES ( N'Deleted',1)
;
INSERT into [SyncRS_ItemLogType] (Name,IsActive) VALUES ( N'Moved',1)
;
INSERT into [SyncRS_ItemLogType] (Name,IsActive) VALUES ( N'Copied',1)
;
INSERT into [SyncRS_ItemLogType] (Name,IsActive) VALUES ( N'Cloned',1)
;
INSERT into [SyncRS_ItemLogType] (Name,IsActive) VALUES ( N'Trashed',1)
;
INSERT into [SyncRS_ItemLogType] (Name,IsActive) VALUES ( N'Restored',1)
;
INSERT into [SyncRS_ItemLogType] (Name,IsActive) VALUES ( N'Rollbacked',1)
;

INSERT into [SyncRS_SystemLogType] (Name,IsActive) VALUES (N'Updated',1)
;

INSERT into [SyncRS_UserLogType] (Name,IsActive) VALUES ( N'Added',1)
;
INSERT into [SyncRS_UserLogType] (Name,IsActive) VALUES ( N'Updated',1)
;
INSERT into [SyncRS_UserLogType] (Name,IsActive) VALUES ( N'Deleted',1)
;
INSERT into [SyncRS_UserLogType] (Name,IsActive) VALUES ( N'Changed',1)
;

INSERT into [SyncRS_ExportType] (Name,IsActive) VALUES (N'Excel', 1)
;
INSERT into [SyncRS_ExportType] (Name,IsActive) VALUES (N'HTML', 1)
;
INSERT into [SyncRS_ExportType] (Name,IsActive) VALUES (N'PDF', 1)
;
INSERT into [SyncRS_ExportType] (Name,IsActive) VALUES (N'Word', 1)
;
INSERT into [SyncRS_ExportType] (Name,IsActive) VALUES (N'Image', 1)
;
INSERT into [SyncRS_ExportType] (Name,IsActive) VALUES (N'PPT', 1)
;
INSERT into [SyncRS_ExportType] (Name,IsActive) VALUES (N'CSV', 1)
;

INSERT into [SyncRS_RecurrenceType] (Name,IsActive) VALUES (N'Daily', 1)
;
INSERT into [SyncRS_RecurrenceType] (Name,IsActive) VALUES (N'DailyWeekDay', 1)
;
INSERT into [SyncRS_RecurrenceType] (Name,IsActive) VALUES (N'Weekly', 1)
;
INSERT into [SyncRS_RecurrenceType] (Name,IsActive) VALUES (N'Monthly', 1)
;
INSERT into [SyncRS_RecurrenceType] (Name,IsActive) VALUES (N'MonthlyDOW', 1)
;
INSERT into [SyncRS_RecurrenceType] (Name,IsActive) VALUES (N'Yearly', 1)
;
INSERT into [SyncRS_RecurrenceType] (Name,IsActive) VALUES (N'YearlyDOW', 1)
;
INSERT into [SyncRS_RecurrenceType] (Name,IsActive) VALUES (N'Time', 1)
;
INSERT into [SyncRS_RecurrenceType] (Name,IsActive) VALUES (N'Hourly', 1)
;

INSERT into [SyncRS_ScheduleStatus] (Name,IsActive) VALUES (N'Success', 1)
;
INSERT into [SyncRS_ScheduleStatus] (Name,IsActive) VALUES (N'Failure', 1)
;

INSERT into [SyncRS_PermissionEntity] (Name,EntityType,ItemTypeId, IsActive) VALUES (N'All Reports',1,3,1)
;
INSERT into [SyncRS_PermissionEntity] (Name,EntityType,ItemTypeId,IsActive) VALUES (N'Reports in Category',2,1,1)
;
INSERT into [SyncRS_PermissionEntity] (Name,EntityType,ItemTypeId,IsActive) VALUES (N'Specific Report',0,3,1)
;
INSERT into [SyncRS_PermissionEntity] (Name,EntityType,ItemTypeId,IsActive) VALUES (N'All Categories',1,1,1)
;
INSERT into [SyncRS_PermissionEntity] (Name,EntityType,ItemTypeId,IsActive) VALUES (N'Specific Category',0,1,1)
;
INSERT into [SyncRS_PermissionEntity] (Name,EntityType,ItemTypeId,IsActive) VALUES (N'All Data Sources',1,4,1)
;
INSERT into [SyncRS_PermissionEntity] (Name,EntityType,ItemTypeId,IsActive) VALUES (N'Specific Data Source',0,4,1)
;
INSERT into [SyncRS_PermissionEntity] (Name,EntityType,ItemTypeId,IsActive) VALUES (N'All Files',1,6,1)
;
INSERT into [SyncRS_PermissionEntity] (Name,EntityType,ItemTypeId,IsActive) VALUES (N'Specific File',0,6,1)
;
INSERT into [SyncRS_PermissionEntity] (Name,EntityType,ItemTypeId,IsActive) VALUES (N'All Schedules',1,7,1)
;
INSERT into [SyncRS_PermissionEntity] (Name,EntityType,ItemTypeId,IsActive) VALUES (N'Specific Schedule',0,7,1)
;
INSERT into [SyncRS_PermissionEntity] (Name,EntityType,ItemTypeId,IsActive) VALUES (N'All Dashboards',1,2,1)
;
INSERT into [SyncRS_PermissionEntity] (Name,EntityType,ItemTypeId,IsActive) VALUES (N'Dashboards in Category',2,1,1)
;
INSERT into [SyncRS_PermissionEntity] (Name,EntityType,ItemTypeId,IsActive) VALUES (N'Specific Dashboard',0,2, 1)
;
insert into [SyncRS_PermissionEntity] (Name,EntityType,ItemTypeId,IsActive) values(N'All Widgets',1,8,1)
;
insert into [SyncRS_PermissionEntity] (Name,EntityType,ItemTypeId,IsActive) values(N'Specific Widget',0,8,1)
;
INSERT into [SyncRS_PermissionEntity] (Name,EntityType,ItemTypeId,IsActive) VALUES (N'All Datasets',1,5,1)
;
INSERT into [SyncRS_PermissionEntity] (Name,EntityType,ItemTypeId,IsActive) VALUES (N'Specific Dataset',0,5,1)
;
INSERT into [SyncRS_PermissionEntity] (Name,EntityType,ItemTypeId,IsActive) VALUES (N'Specific ItemView',0,9,1)
;
INSERT into [SyncRS_PermissionEntity] (Name,EntityType,ItemTypeId,IsActive) VALUES (N'All ItemViews',1,9,1)
;

INSERT into [SyncRS_Group] (Name,Description,Color,ModifiedDate,IsActive) VALUES (N'System Administrator','Has administrative rights for the report server','#ff0000',GETDATE(), 1)
;

INSERT into [SyncRS_ItemCommentLogType] (Name,IsActive) VALUES ( N'Added',1)
;
INSERT into [SyncRS_ItemCommentLogType] (Name,IsActive) VALUES ( N'Edited',1)
;
INSERT into [SyncRS_ItemCommentLogType] (Name,IsActive) VALUES ( N'Deleted',1)
;
INSERT into [SyncRS_ItemCommentLogType] (Name,IsActive) VALUES ( N'Upvoted',1)
;
INSERT into [SyncRS_ItemCommentLogType] (Name,IsActive) VALUES ( N'Downvoted',1)
;
INSERT into [SyncRS_ItemCommentLogType] (Name,IsActive) VALUES ( N'Replied',1)
;
INSERT into [SyncRS_ItemCommentLogType] (Name,IsActive) VALUES ( N'UserMention',1)
;
INSERT into [SyncRS_UserType](Type) values(N'Server User')
;
INSERT into [SyncRS_UserType](Type) values(N'Active Directory User')
;
INSERT into [SyncRS_UserType](Type) values(N'Federation User')
;

CREATE TABLE [SyncRS_PermissionAccess](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[Name] nvarchar(100) UNIQUE NOT NULL,
	[AccessId] [int] UNIQUE NOT NULL,
	[IsActive] [bit] NOT NULL)
;

CREATE TABLE [SyncRS_PermissionAccEntity](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[PermissionEntityId] [int] NOT NULL,
	[PermissionAccessId] [int] NOT NULL,
	[IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncRS_PermissionAccEntity]  ADD FOREIGN KEY([PermissionEntityId]) REFERENCES [SyncRS_PermissionEntity] ([Id])
;
ALTER TABLE [SyncRS_PermissionAccEntity]  ADD FOREIGN KEY([PermissionAccessId]) REFERENCES [SyncRS_PermissionAccess] ([Id])
;

INSERT INTO [SyncRS_PermissionAccess] (Name, AccessId, IsActive) VALUES (N'Create',1,1)
;
INSERT INTO [SyncRS_PermissionAccess] (Name, AccessId, IsActive) VALUES (N'Read',2,1)
;
INSERT INTO [SyncRS_PermissionAccess] (Name, AccessId, IsActive) VALUES (N'Read, Write',6,1)
;
INSERT INTO [SyncRS_PermissionAccess] (Name, AccessId, IsActive) VALUES (N'Read, Write, Delete',14,1)
;
INSERT INTO [SyncRS_PermissionAccess] (Name, AccessId, IsActive) VALUES (N'Read, Download',18,1)
;
INSERT INTO [SyncRS_PermissionAccess] (Name, AccessId, IsActive) VALUES (N'Read, Write, Download',22,1)
;
INSERT INTO [SyncRS_PermissionAccess] (Name, AccessId, IsActive) VALUES (N'Read, Write, Delete, Download',30,1)
;

INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(4,1,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(6,1,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(10,1,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(1,1,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(2,1,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(17,1,1)
;	
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(8,1,1)
;		
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(1,2,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(2,2,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(3,2,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(4,2,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(5,2,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(10,2,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(11,2,1)
;			
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(4,3,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(5,3,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(10,3,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(11,3,1)
;			
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(4,4,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(5,4,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(10,4,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(11,4,1)
;			
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(1,5,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(2,5,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(3,5,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(17,5,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(18,5,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(6,5,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(7,5,1)
;	
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(8,5,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(9,5,1)
;		
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(1,6,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(2,6,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(3,6,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(17,6,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(18,6,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(6,6,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(7,6,1)
;	
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(8,6,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(9,6,1)
;
		
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(1,7,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(2,7,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(3,7,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(6,7,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(7,7,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(17,7,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(18,7,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(8,7,1)
;
INSERT INTO [SyncRS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES(9,7,1)
;