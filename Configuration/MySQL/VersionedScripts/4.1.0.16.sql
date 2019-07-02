CREATE TABLE {database_name}.SyncRS_UmsCredential(
	Id int AUTO_INCREMENT NOT NULL,
	UmsUrl varchar(255),
	ClientId varchar(255),
	ClientSecret varchar(255),
    IsActive bit NOT NULL,
	PRIMARY KEY (Id))
;

CREATE TABLE {database_name}.SyncRS_UmsGroup(
	Id int AUTO_INCREMENT NOT NULL,
	GroupId int NOT NULL,
	UmsGroupId int NOT NULL,
	IsActive tinyint(1) NOT NULL,
	PRIMARY KEY (Id))
;

ALTER TABLE {database_name}.SyncRS_UmsGroup ADD FOREIGN KEY(GroupId) REFERENCES {database_name}.SyncRS_Group (Id)
;

CREATE TABLE {database_name}.SyncRS_UmsUser(
	Id int AUTO_INCREMENT NOT NULL,
	UserId int NOT NULL,
	UmsUserId int NOT NULL,
	IsActive tinyint(1) NOT NULL,
	PRIMARY KEY (Id))
;

ALTER TABLE {database_name}.SyncRS_UmsUser ADD FOREIGN KEY(UserId) REFERENCES {database_name}.SyncRS_User (Id)
;

ALTER TABLE {database_name}.SyncRS_User ADD DomainId varchar(4000) NULL
;
ALTER TABLE {database_name}.SyncRS_Group ADD DomainId varchar(4000) NULL
; 
