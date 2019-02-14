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
ALTER TABLE [SyncRS_User] ALTER COLUMN LastName nvarchar(255) null
;
ALTER TABLE [SyncRS_User] ALTER COLUMN Email nvarchar(255) null
;
ALTER TABLE [SyncRS_User] ALTER COLUMN Email nvarchar(512) null
;
ALTER TABLE [SyncRS_Item] ADD [IsPublic] bit NOT NULL DEFAULT(0)
;

insert into [SyncRS_ItemType] (Name,IsActive) values (N'Widget',1)
;
insert into [SyncRS_ItemType] (Name,IsActive) values (N'ItemView',1)
;
INSERT into [SyncRS_PermissionEntity] (Name,EntityType,IsActive) VALUES (N'Specific ItemView',0, 1)
;
sp_rename 'SyncRS_ActiveDirectoryGroup','SyncRS_ADGroup';

sp_rename 'SyncRS_ActiveDirectoryUser','SyncRS_ADUser';


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
    [Name] [nvarchar](100) NULL,
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

ALTER TABLE [SyncRS_User] ADD [UserTypeId] [int] NOT NULL DEFAULT 0
;

UPDATE [SyncRS_User] SET UserTypeId = 1 WHERE [SyncRS_User].Id In (SELECT [SyncRS_User].Id from [SyncRS_User] INNER JOIN [SyncRS_ADUser] on [SyncRS_ADUser].UserId = [SyncRS_User].Id)
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
	[IsEnabled] bit NOT NULL)
;

CREATE TABLE [SyncRS_UserType](
	[Id] [int] IDENTITY(1,1) primary key NOT NULL, 
	[Type] nvarchar(100))
;

INSERT into [SyncRS_UserType](Type) values(N'Server User')
;
INSERT into [SyncRS_UserType](Type) values(N'Active Directory User')
;
INSERT into [SyncRS_UserType](Type) values(N'Federation User')
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
INSERT into [SyncRS_ItemCommentLogType] (Name,IsActive) VALUES ( N'UserMention',1)
;