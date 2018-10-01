INSERT into [SyncRS_ExportType] (Name,IsActive) VALUES (N'PPT', 1)
;

ALTER TABLE [SyncRS_User] ADD [PasswordChangedDate] datetime NULL
;

ALTER TABLE [SyncRS_PermissionEntity] ADD  [ItemTypeId] INT 
;
UPDATE [SyncRS_PermissionEntity] SET [ItemTypeId]=3 WHERE Id =1
;
UPDATE [SyncRS_PermissionEntity] SET [ItemTypeId]=1 WHERE Id =2
;
UPDATE [SyncRS_PermissionEntity] SET [ItemTypeId]=3 WHERE Id =3
;
UPDATE [SyncRS_PermissionEntity] SET [ItemTypeId]=1 WHERE Id =4
;
UPDATE [SyncRS_PermissionEntity] SET [ItemTypeId]=1 WHERE Id =5
;
UPDATE [SyncRS_PermissionEntity] SET [ItemTypeId]=4 WHERE Id =6
;
UPDATE [SyncRS_PermissionEntity] SET [ItemTypeId]=4 WHERE Id =7
;
UPDATE [SyncRS_PermissionEntity] SET [ItemTypeId]=6 WHERE Id =8
;
UPDATE [SyncRS_PermissionEntity] SET [ItemTypeId]=6 WHERE Id =9
;
UPDATE [SyncRS_PermissionEntity] SET [ItemTypeId]=7 WHERE Id =10
;
UPDATE [SyncRS_PermissionEntity] SET [ItemTypeId]=7 WHERE Id =11
;
UPDATE [SyncRS_PermissionEntity] SET [ItemTypeId]=2 WHERE Id =12
;
UPDATE [SyncRS_PermissionEntity] SET [ItemTypeId]=1 WHERE Id =13
;
UPDATE [SyncRS_PermissionEntity] SET [ItemTypeId]=2 WHERE Id =14
;
UPDATE [SyncRS_PermissionEntity] SET [ItemTypeId]=8 WHERE Id =15
;
UPDATE [SyncRS_PermissionEntity] SET [ItemTypeId]=8 WHERE Id =16
;
UPDATE [SyncRS_PermissionEntity] SET [ItemTypeId]=5 WHERE Id =17
;
UPDATE [SyncRS_PermissionEntity] SET [ItemTypeId]=5 WHERE Id =18
;
UPDATE [SyncRS_PermissionEntity] SET [ItemTypeId]=9 WHERE Id =19
;
ALTER TABLE [SyncRS_PermissionEntity] ALTER COLUMN [ItemTypeId] INT NOT NULL
;
ALTER TABLE [SyncRS_PermissionEntity] ADD Foreign key([ItemTypeId]) references SyncRS_ItemType([Id])
;
ALTER TABLE [SyncRS_SAMLSettings] ADD [Authority] NVARCHAR(4000)
;
ALTER TABLE [SyncRS_SAMLSettings] ADD [DesignerClientId] NVARCHAR(100)
;
ALTER TABLE [SyncRS_SAMLSettings] ADD [TenantName] NVARCHAR(100)
;
ALTER TABLE [SyncRS_SystemSettings] ADD CONSTRAINT UK_SyncRS_SystemSettings_Key UNIQUE ([Key])
;