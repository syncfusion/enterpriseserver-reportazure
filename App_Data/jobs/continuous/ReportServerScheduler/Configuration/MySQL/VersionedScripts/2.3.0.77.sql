CREATE TABLE {database_name}.SyncRS_PermissionAccess(
	Id int AUTO_INCREMENT NOT NULL,
	Name varchar(100) NOT NULL UNIQUE,
	AccessId int NOT NULL UNIQUE,
	IsActive tinyint(1) NOT NULL,
	PRIMARY KEY (Id))
;

CREATE TABLE {database_name}.SyncRS_PermissionAccEntity(
	Id int AUTO_INCREMENT NOT NULL,
	PermissionEntityId int NOT NULL,
	PermissionAccessId int NOT NULL,
	IsActive tinyint(1) NOT NULL,
	PRIMARY KEY (Id))
;

ALTER TABLE {database_name}.SyncRS_PermissionAccEntity  ADD FOREIGN KEY(PermissionEntityId) REFERENCES {database_name}.SyncRS_PermissionEntity (Id)
;
ALTER TABLE {database_name}.SyncRS_PermissionAccEntity  ADD FOREIGN KEY(PermissionAccessId) REFERENCES {database_name}.SyncRS_PermissionAccess (Id)
;

INSERT into {database_name}.SyncRS_PermissionAccess (Name, AccessId, IsActive) VALUES (N'Create',1,1)
;
INSERT into {database_name}.SyncRS_PermissionAccess (Name, AccessId, IsActive) VALUES (N'Read',2,1), (N'Read, Write',6,1), (N'Read, Write, Delete',14,1)
;
INSERT into {database_name}.SyncRS_PermissionAccess (Name, AccessId, IsActive) VALUES (N'Read, Download',18,1), (N'Read, Write, Download',22,1), (N'Read, Write, Delete, Download',30,1)
;

INSERT into {database_name}.SyncRS_PermissionAccEntity (PermissionEntityId, PermissionAccessId, IsActive) VALUES (4,1,1), (6,1,1), (10,1,1), (1,1,1), (2,1,1), (17,1,1), (8,1,1)
;
INSERT into {database_name}.SyncRS_PermissionAccEntity (PermissionEntityId, PermissionAccessId, IsActive) VALUES (1,2,1), (2,2,1), (3,2,1), (4,2,1), (5,2,1), (10,2,1), (11,2,1)
;
INSERT into {database_name}.SyncRS_PermissionAccEntity (PermissionEntityId, PermissionAccessId, IsActive) VALUES (4,3,1), (5,3,1), (10,3,1), (11,3,1)
;
INSERT into {database_name}.SyncRS_PermissionAccEntity (PermissionEntityId, PermissionAccessId, IsActive) VALUES (4,4,1), (5,4,1), (10,4,1), (11,4,1)
;
INSERT into {database_name}.SyncRS_PermissionAccEntity (PermissionEntityId, PermissionAccessId, IsActive) VALUES (1,5,1), (2,5,1), (3,5,1), (17,5,1), (18,5,1), (6,5,1), (7,5,1), (8,5,1), (9,5,1)
;
INSERT into {database_name}.SyncRS_PermissionAccEntity (PermissionEntityId, PermissionAccessId, IsActive) VALUES (1,6,1), (2,6,1), (3,6,1), (17,6,1), (18,6,1), (6,6,1), (7,6,1), (8,6,1), (9,6,1)
;
INSERT into {database_name}.SyncRS_PermissionAccEntity (PermissionEntityId, PermissionAccessId, IsActive) VALUES (1,7,1), (2,7,1), (3,7,1), (6,7,1), (7,7,1), (17,7,1), (18,7,1), (8,7,1), (9,7,1)
;

UPDATE {database_name}.SyncRS_UserPermission SET PermissionAccessId='18' WHERE PermissionAccessId='2' AND PermissionEntityId NOT IN ('4', '5', '10', '11', '19', '20')
;
UPDATE {database_name}.SyncRS_UserPermission SET PermissionAccessId='22' WHERE PermissionAccessId='6' AND PermissionEntityId NOT IN ('4', '5', '10', '11', '19', '20')
;
UPDATE {database_name}.SyncRS_UserPermission SET PermissionAccessId='30' WHERE PermissionAccessId='14' AND PermissionEntityId NOT IN ('4', '5', '10', '11', '19', '20')
;

UPDATE {database_name}.SyncRS_GroupPermission SET PermissionAccessId='18' WHERE PermissionAccessId='2' AND PermissionEntityId NOT IN ('4', '5', '10', '11', '19', '20')
;
UPDATE {database_name}.SyncRS_GroupPermission SET PermissionAccessId='22' WHERE PermissionAccessId='6' AND PermissionEntityId NOT IN ('4', '5', '10', '11', '19', '20')
;
UPDATE {database_name}.SyncRS_GroupPermission SET PermissionAccessId='30' WHERE PermissionAccessId='14' AND PermissionEntityId NOT IN ('4', '5', '10', '11', '19', '20')
;

ALTER TABLE {database_name}.SyncRS_ItemCommentLogType ADD CONSTRAINT UNIQUE (Name)
;
ALTER TABLE {database_name}.SyncRS_ExportType ADD CONSTRAINT UNIQUE (Name)
;
ALTER TABLE {database_name}.SyncRS_ItemLogType ADD CONSTRAINT UNIQUE (Name)
;
ALTER TABLE {database_name}.SyncRS_ItemType ADD CONSTRAINT UNIQUE (Name)
;
ALTER TABLE {database_name}.SyncRS_PermissionEntity ADD CONSTRAINT UNIQUE (Name)
;
ALTER TABLE {database_name}.SyncRS_RecurrenceType ADD CONSTRAINT UNIQUE (Name)
;
ALTER TABLE {database_name}.SyncRS_SystemLogType ADD CONSTRAINT UNIQUE (Name)
;
ALTER TABLE {database_name}.SyncRS_UserLogType ADD CONSTRAINT UNIQUE (Name)
;
ALTER TABLE {database_name}.SyncRS_UserType ADD CONSTRAINT UNIQUE (Type)
;
INSERT into {database_name}.SyncRS_ExportType (Name,IsActive) VALUES ('CSV', 1)
;
INSERT into {database_name}.SyncRS_RecurrenceType (Name,IsActive) VALUES ('Hourly',1)
;
ALTER TABLE {database_name}.SyncRS_SAMLSettings ADD MobileAppId VARCHAR(100)
;