CREATE TABLE "SyncRS_DBCredential"(
    "Id" int PRIMARY KEY NOT NULL,
    "DatabaseType" NVARCHAR2(255) NOT NULL,
    "ConnectionString" VARCHAR2(4000) NOT NULL,
    "Status"  NVARCHAR2(255) NOT NULL,
    "ActiveStatusValue"  NVARCHAR2(255) NOT NULL,
    "UserNameSchema" NVARCHAR2(255) NOT NULL,
    "UserNameTable" NVARCHAR2(255) NOT NULL,
    "UserNameColumn" NVARCHAR2(255) NOT NULL,
    "FirstNameSchema" NVARCHAR2(255) NOT NULL,
    "FirstNameTable" NVARCHAR2(255) NOT NULL,
    "FirstNameColumn" NVARCHAR2(255) NOT NULL,
    "LastNameSchema" NVARCHAR2(255) NOT NULL,
    "LastNameTable" NVARCHAR2(255) NOT NULL,
    "LastNameColumn" NVARCHAR2(255) NOT NULL,
    "EmailSchema" NVARCHAR2(255) NOT NULL,
    "EmailTable" NVARCHAR2(255) NOT NULL,
    "EmailColumn" NVARCHAR2(255) NOT NULL,
    "IsActiveColumn" NVARCHAR2(255) NOT NULL,
    "IsActiveSchema" NVARCHAR2(255) NOT NULL,
    "IsActiveTable" NVARCHAR2(255) NOT NULL,
    "EmailRelationId" int NULL,
    "FirstNameRelationId" int NULL,
    "IsActiveRelationId" int NULL,
    "LastNameRelationId" int NULL,
    "IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_DBCredential_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

CREATE TABLE "SyncRS_TableRelation"(
    "Id" int PRIMARY KEY NOT NULL,
    "LeftTable" NVARCHAR2(255) NOT NULL,
    "LeftTableColumnName" NVARCHAR2(255) NOT NULL,	
    "LeftTableCondition"  NVARCHAR2(255) NOT NULL,
    "LeftTableName"  NVARCHAR2(255) NOT NULL,
    "LeftTableSchema" NVARCHAR2(255) NOT NULL,
    "Relationship" NVARCHAR2(255) NOT NULL,
    "RightTable" NVARCHAR2(255) NOT NULL,
    "RightTableColumnName" NVARCHAR2(255) NOT NULL,	
    "RightTableCondition"  NVARCHAR2(255) NOT NULL,
    "RightTableName"  NVARCHAR2(255) NOT NULL,
    "RightTableSchema" NVARCHAR2(255) NOT NULL)
;

CREATE SEQUENCE "SyncRS_TableRelation_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;
