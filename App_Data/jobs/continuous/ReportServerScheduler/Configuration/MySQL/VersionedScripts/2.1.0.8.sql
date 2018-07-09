INSERT into {database_name}.SyncRS_ExportType (Name,IsActive) VALUES ('PPT', 1)
;

ALTER TABLE {database_name}.SyncRS_User  ADD PasswordChangedDate datetime NULL
;

ALTER TABLE {database_name}.SyncRS_PermissionEntity ADD ItemTypeId INT 
;
UPDATE {database_name}.SyncRS_PermissionEntity SET ItemTypeId=3 WHERE {database_name}.SyncRS_PermissionEntity.Id =1
;
UPDATE {database_name}.SyncRS_PermissionEntity SET ItemTypeId=1 WHERE {database_name}.SyncRS_PermissionEntity.Id =2
;
UPDATE {database_name}.SyncRS_PermissionEntity SET ItemTypeId=3 WHERE {database_name}.SyncRS_PermissionEntity.Id =3
;
UPDATE {database_name}.SyncRS_PermissionEntity SET ItemTypeId=1 WHERE {database_name}.SyncRS_PermissionEntity.Id =4
;
UPDATE {database_name}.SyncRS_PermissionEntity SET ItemTypeId=1 WHERE {database_name}.SyncRS_PermissionEntity.Id =5
;
UPDATE {database_name}.SyncRS_PermissionEntity SET ItemTypeId=4 WHERE {database_name}.SyncRS_PermissionEntity.Id =6
;
UPDATE {database_name}.SyncRS_PermissionEntity SET ItemTypeId=4 WHERE {database_name}.SyncRS_PermissionEntity.Id =7
;
UPDATE {database_name}.SyncRS_PermissionEntity SET ItemTypeId=6 WHERE {database_name}.SyncRS_PermissionEntity.Id =8;

UPDATE {database_name}.SyncRS_PermissionEntity SET ItemTypeId=6 WHERE {database_name}.SyncRS_PermissionEntity.Id =9
;
UPDATE {database_name}.SyncRS_PermissionEntity SET ItemTypeId=7 WHERE {database_name}.SyncRS_PermissionEntity.Id =10
;
UPDATE {database_name}.SyncRS_PermissionEntity SET ItemTypeId=7 WHERE {database_name}.SyncRS_PermissionEntity.Id =11
;
UPDATE {database_name}.SyncRS_PermissionEntity SET ItemTypeId=2 WHERE {database_name}.SyncRS_PermissionEntity.Id =12
;
UPDATE {database_name}.SyncRS_PermissionEntity SET ItemTypeId=1 WHERE {database_name}.SyncRS_PermissionEntity.Id =13
;
UPDATE {database_name}.SyncRS_PermissionEntity SET ItemTypeId=2 WHERE {database_name}.SyncRS_PermissionEntity.Id =14
;
UPDATE {database_name}.SyncRS_PermissionEntity SET ItemTypeId=8 WHERE {database_name}.SyncRS_PermissionEntity.Id =15
;
UPDATE {database_name}.SyncRS_PermissionEntity SET ItemTypeId=8 WHERE {database_name}.SyncRS_PermissionEntity.Id =16
;
UPDATE {database_name}.SyncRS_PermissionEntity SET ItemTypeId=5 WHERE {database_name}.SyncRS_PermissionEntity.Id =17
;
UPDATE {database_name}.SyncRS_PermissionEntity SET ItemTypeId=5 WHERE {database_name}.SyncRS_PermissionEntity.Id =18
;
UPDATE {database_name}.SyncRS_PermissionEntity SET ItemTypeId=9 WHERE {database_name}.SyncRS_PermissionEntity.Id =19
;
ALTER TABLE {database_name}.SyncRS_PermissionEntity MODIFY COLUMN ItemTypeId INT NOT NULL
;
ALTER TABLE {database_name}.SyncRS_PermissionEntity ADD Foreign key(ItemTypeId) references {database_name}.SyncRS_ItemType (Id)
;
ALTER TABLE {database_name}.SyncRS_SAMLSettings ADD Authority VARCHAR(4000)
;
ALTER TABLE {database_name}.SyncRS_SAMLSettings ADD DesignerClientId VARCHAR(100)
;
ALTER TABLE {database_name}.SyncRS_SAMLSettings ADD TenantName VARCHAR(100)
;
ALTER TABLE {database_name}.SyncRS_SystemSettings ADD CONSTRAINT UK_SyncRS_SystemSettings_Key UNIQUE(`Key`)
;