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

UPDATE [SyncRS_UserPermission] SET [PermissionAccessId]='18' WHERE [PermissionAccessId]='2' AND [PermissionEntityId] NOT IN ('4', '5', '10', '11', '19', '20')
;
UPDATE [SyncRS_UserPermission] SET [PermissionAccessId]='22' WHERE [PermissionAccessId]='6' AND [PermissionEntityId] NOT IN ('4', '5', '10', '11', '19', '20')
;
UPDATE [SyncRS_UserPermission] SET [PermissionAccessId]='30' WHERE [PermissionAccessId]='14' AND [PermissionEntityId] NOT IN ('4', '5', '10', '11', '19', '20')
;

UPDATE [SyncRS_GroupPermission] SET [PermissionAccessId]='18' WHERE [PermissionAccessId]='2' AND [PermissionEntityId] NOT IN ('4', '5', '10', '11', '19', '20')
;
UPDATE [SyncRS_GroupPermission] SET [PermissionAccessId]='22' WHERE [PermissionAccessId]='6' AND [PermissionEntityId] NOT IN ('4', '5', '10', '11', '19', '20')
;
UPDATE [SyncRS_GroupPermission] SET [PermissionAccessId]='30' WHERE [PermissionAccessId]='14' AND [PermissionEntityId] NOT IN ('4', '5', '10', '11', '19', '20')
;

ALTER TABLE [SyncRS_ItemCommentLogType] ADD UNIQUE ([Name])
;
ALTER TABLE [SyncRS_ExportType] ADD UNIQUE ([Name])
;
ALTER TABLE [SyncRS_ItemLogType] ADD UNIQUE ([Name])
;
ALTER TABLE [SyncRS_ItemType] ADD UNIQUE ([Name])
;
ALTER TABLE [SyncRS_PermissionEntity] ADD UNIQUE ([Name])
;
ALTER TABLE [SyncRS_RecurrenceType] ADD UNIQUE ([Name])
;
ALTER TABLE [SyncRS_SystemLogType] ADD UNIQUE ([Name])
;
ALTER TABLE [SyncRS_UserLogType] ADD UNIQUE ([Name])
;
ALTER TABLE [SyncRS_UserType] ADD UNIQUE ([Type])
;
INSERT into [SyncRS_ExportType] (Name,IsActive) VALUES (N'CSV', 1)
;
INSERT into [SyncRS_RecurrenceType] (Name,IsActive) VALUES (N'Hourly', 1)
;
ALTER TABLE [SyncRS_SAMLSettings] ADD [MobileAppId] NVARCHAR(100)
;