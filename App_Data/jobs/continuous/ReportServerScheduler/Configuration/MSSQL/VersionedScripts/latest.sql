CREATE TABLE [SyncRS_UmsCredential](
	[Id] [int] IDENTITY(1,1) primary key NOT NULL,
	[UmsUrl] [nvarchar](255),
	[ClientId] [nvarchar](100),
	[ClientSecret] [nvarchar](100),
	[IsActive] [bit] NOT NULL)
;

CREATE TABLE [SyncRS_UmsGroup](
	[Id] [int] IDENTITY(1,1) primary key NOT NULL,
	[GroupId] [int] NOT NULL,
	[UmsGroupId] [int] NOT NULL,
	[IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncRS_UmsGroup] ADD FOREIGN KEY([GroupId]) REFERENCES [SyncRS_Group] ([Id])
;

CREATE TABLE [SyncRS_UmsUser](
	[Id] [int] IDENTITY(1,1) primary key NOT NULL,
	[UserId] [int] NOT NULL,
	[UmsUserId] [int] NOT NULL,
	[IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncRS_UmsUser] ADD FOREIGN KEY([UserId]) REFERENCES [SyncRS_User] ([Id])
;

ALTER TABLE [SyncRS_User] ADD [DomainId] [nvarchar](4000) NULL
;
ALTER TABLE [SyncRS_Group] ADD [DomainId] [nvarchar](4000) NULL
;