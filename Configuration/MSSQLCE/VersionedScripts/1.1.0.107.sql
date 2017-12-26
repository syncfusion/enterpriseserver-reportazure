ALTER TABLE [SystemSettings] ADD [Value_new] nvarchar(4000) NULL
;

UPDATE [SystemSettings] SET [Value_new] = [Value]
;

ALTER TABLE [SystemSettings] DROP column [Value]
;

ALTER TABLE [SystemSettings] ADD [Value] nvarchar(4000) NULL
;

UPDATE [SystemSettings] SET [Value] = [Value_new]
;

ALTER TABLE [SystemSettings] DROP column [Value_new]
;

ALTER TABLE [ScheduleDetail] ADD [RecurrenceInfo_new] nvarchar(4000) NULL
;

UPDATE [ScheduleDetail] SET [RecurrenceInfo_new] = [RecurrenceInfo] 
;

ALTER TABLE [ScheduleDetail] DROP COLUMN [RecurrenceInfo]
;

ALTER TABLE [ScheduleDetail] ADD [RecurrenceInfo] nvarchar(4000) NULL
;

UPDATE [ScheduleDetail] SET [RecurrenceInfo] = [RecurrenceInfo_new]
;

ALTER TABLE [ScheduleDetail] DROP column [RecurrenceInfo_new]
;

ALTER TABLE [ItemVersion] ADD [Comment_new] nvarchar(1026) NULL
;

UPDATE [ItemVersion] SET [Comment_new] = [Comment] 
;

ALTER TABLE [ItemVersion] DROP COLUMN [Comment]
;

ALTER TABLE [ItemVersion] ADD [Comment] nvarchar(1026) NULL
;

UPDATE [ItemVersion] SET [Comment] = [Comment_new]
;

ALTER TABLE [ItemVersion] DROP column [Comment_new]
;

ALTER TABLE [UserLogin] ADD [ClientToken_new] nvarchar(4000) NULL
;

UPDATE [UserLogin] SET [ClientToken_new] = [ClientToken]
;

ALTER TABLE [UserLogin] DROP column [ClientToken]
;

ALTER TABLE [UserLogin] ADD [ClientToken] nvarchar(4000) NULL
;

UPDATE [UserLogin] SET [ClientToken] = [ClientToken_new]
;

ALTER TABLE [UserLogin] DROP column [ClientToken_new]
;

ALTER TABLE [UserLogin] ALTER COLUMN [ClientToken] nvarchar(4000) NOT NULL
;

ALTER TABLE [UserPreference] DROP COLUMN [ItemSort]
;

ALTER TABLE [UserPreference] ADD [ItemSort] nvarchar(4000) null
;

ALTER TABLE [UserPreference] DROP COLUMN [ItemFilters]
;

ALTER TABLE [UserPreference] ADD [ItemFilters] nvarchar(4000) null
;

ALTER TABLE [UserPermission] ADD PRIMARY KEY ([Id])
;

ALTER TABLE [GroupPermission] ADD PRIMARY KEY ([Id])
;

ALTER TABLE [ServerVersion] ADD [Id] int NULL
;

UPDATE [ServerVersion] SET [Id]=1
;

ALTER TABLE [ServerVersion] ALTER COLUMN [Id] [int] NOT NULL
;

ALTER TABLE [ServerVersion] ADD PRIMARY KEY ([Id])
;

UPDATE [PermissionEntity] SET [Name]='Specific File' WHERE Id=9
;

INSERT into [ExportType] (Name,IsActive) VALUES (N'Image', 1)
;

ALTER TABLE [Item] ALTER COLUMN [Name] [nvarchar](255) NOT NULL
;

ALTER TABLE [ItemVersion] ALTER COLUMN [ItemName] [nvarchar](265) NULL
;

ALTER TABLE [SystemSettings] ADD [ModifiedDate] datetime NULL
;

UPDATE [SystemSettings] SET [ModifiedDate]=GetDate()
;

ALTER TABLE [SystemSettings] ALTER COLUMN [ModifiedDate] datetime NOT NULL
;

ALTER TABLE [UserPreference] ADD [Language_new] nvarchar(4000) NULL
;

UPDATE [UserPreference] SET [Language_new] = [Language]
;

ALTER TABLE [UserPreference] DROP column [Language]
;

ALTER TABLE [UserPreference] ADD [Language] nvarchar(4000) NULL
;

UPDATE [UserPreference] SET [Language] = [Language_new]
;

ALTER TABLE [UserPreference] DROP column [Language_new]
;

CREATE TABLE [SubscribedExternalRecipient](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[ScheduleId] [uniqueidentifier] NOT NULL,
	[SubscribedById] [int] NOT NULL,
	[EmailIds] [NVARCHAR](4000) NOT NULL,
	[SubscribedDate] [datetime] NOT NULL,
	[ModifiedDate] [datetime] NOT NULL,
	[IsActive] [bit] NOT NULL)
;
	
ALTER TABLE [SubscribedExternalRecipient]  ADD FOREIGN KEY([ScheduleId]) REFERENCES [Item] ([Id])
;

ALTER TABLE [SubscribedExternalRecipient]  ADD FOREIGN KEY([SubscribedById]) REFERENCES [User] ([Id])
;

CREATE TABLE [ScheduleLogExternalRecipient](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[ScheduleId] [uniqueidentifier] NOT NULL,
	[ScheduleStatusId] [int] NOT NULL,
	[DeliveredEmailId] [NVARCHAR](150) NOT NULL,
	[DeliveredDate] [datetime] NOT NULL,
	[IsOnDemand] [bit] NOT NULL,	
	[IsActive] [bit] NOT NULL)
;
	
ALTER TABLE [ScheduleLogExternalRecipient]  ADD FOREIGN KEY([ScheduleStatusId]) REFERENCES [ScheduleStatus] ([Id])
;

ALTER TABLE [ScheduleLogExternalRecipient]  ADD FOREIGN KEY([ScheduleId]) REFERENCES [Item] ([Id])
;

create table ActiveDirectoryUser(
Id int IDENTITY(1,1) primary key NOT NULL,
UserId int not null,
ActiveDirectoryUserId uniqueidentifier not null,
IsActive bit not null)
;

ALTER TABLE [ActiveDirectoryUser] ADD FOREIGN KEY([UserId]) REFERENCES [User] ([Id])
;

create table ActiveDirectoryGroup(
Id int IDENTITY(1,1) primary key NOT NULL,
GroupId int not null,
ActiveDirectoryGroupId uniqueidentifier not null,
IsActive bit not null)
;

ALTER TABLE [ActiveDirectoryGroup] ADD FOREIGN KEY([GroupId]) REFERENCES [Group] ([Id])
;

create table ActiveDirectoryCredentials(
Id int IDENTITY(1,1) primary key NOT NULL,
Username nvarchar(100),
Password nvarchar(100),
LdapUrl nvarchar(255),
EnableSsl bit not null,
DistinguishedName nvarchar(150),
PortNo int not null,
IsActive bit not null)
;