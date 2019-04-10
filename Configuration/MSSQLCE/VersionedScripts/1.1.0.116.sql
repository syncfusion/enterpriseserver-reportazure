insert into [PermissionEntity] (Name,EntityType,IsActive) values(N'All Dashboards',1,1)
;
insert into [PermissionEntity] (Name,EntityType,IsActive) values(N'Dashboards in Category',2,1)
;
insert into [PermissionEntity] (Name,EntityType,IsActive) values(N'Specific Dashboard',0,1)
;
insert into [PermissionEntity] (Name,EntityType,IsActive) values(N'All Widgets',1,1)
;
insert into [PermissionEntity] (Name,EntityType,IsActive) values(N'Specific Widget',0,1)
;
INSERT into [PermissionEntity] (Name,EntityType,IsActive) VALUES (N'All Datasets',1, 1)
;
INSERT into [PermissionEntity] (Name,EntityType,IsActive) VALUES (N'Specific Dataset',0, 1)
;
INSERT INTO [GroupPermission] (PermissionAccessId,PermissionEntityId,ItemId,GroupId,IsActive) VALUES (1,17,NULL,1,N'True')
;

UPDATE [systemsettings] set Value='Login_Logo.png' where [Key] = 'LoginLogo' and [Value]='Syncfusion_Login_Logo.png'
;

UPDATE [systemsettings] set Value='Main_Logo.png' where [Key] = 'MainScreenLogo' and [Value]='Syncfusion_Main_Logo.png'
;

UPDATE [systemsettings] set Value='Favicon.png' where [Key] = 'FavIcon' and [Value]='Syncfusion_Favicon.png'
;

CREATE TABLE [DatasetLinkage](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[DatasetItemId] [uniqueidentifier] NOT NULL,
	[ItemId] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](255) NOT NULL,
	[ModifiedDate] [datetime] NOT NULL,
	[IsActive] [bit] NOT NULL)
;

ALTER TABLE [DatasetLinkage]  ADD FOREIGN KEY([DatasetItemId]) REFERENCES [Item] ([Id])
;
ALTER TABLE [DatasetLinkage]  ADD FOREIGN KEY([ItemId]) REFERENCES [Item] ([Id])
;

sp_rename 'ActiveDirectoryCredentials','ADCredential';

sp_rename 'SubscribedExternalRecipient','SubscrExtnRecpt';

sp_rename 'ScheduleLogExternalRecipient','SchdLogExtnRecpt';
