CREATE TABLE SyncRS_UmsCredential(
	Id SERIAL PRIMARY KEY NOT NULL,
	UmsUrl varchar(255),
	ClientId varchar(255),
	ClientSecret varchar(255),
	IsActive smallint NOT NULL)
;

CREATE TABLE SyncRS_UmsGroup(
	Id SERIAL PRIMARY KEY NOT NULL,
	GroupId int NOT NULL,
	UmsGroupId int NOT NULL,
	IsActive smallint NOT NULL)
;

ALTER TABLE SyncRS_UmsGroup ADD FOREIGN KEY(GroupId) REFERENCES SyncRS_Group (Id)
;

CREATE TABLE SyncRS_UmsUser(
	Id SERIAL PRIMARY KEY NOT NULL,
	UserId int NOT NULL,
	UmsUserId int NOT NULL,
	IsActive smallint NOT NULL)
;

ALTER TABLE SyncRS_UmsUser ADD FOREIGN KEY(UserId) REFERENCES SyncRS_User (Id)
;

ALTER TABLE SyncRS_User ADD DomainId varchar(4000) NULL
;
ALTER TABLE SyncRS_Group ADD DomainId varchar(4000) NULL
;