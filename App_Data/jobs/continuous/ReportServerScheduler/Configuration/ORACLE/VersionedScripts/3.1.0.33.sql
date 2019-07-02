ALTER TABLE "SyncRS_ScheduleDetail" ADD "IsParameterEnabled" NUMBER(1) DEFAULT (0) NOT NULL
;
CREATE TABLE "SyncRS_ScheduleParameter" (
	"Id" int PRIMARY KEY NOT NULL,
	"ScheduleId" NCHAR(36) NOT NULL,
	"Parameter" VARCHAR2(4000) NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncRS_ScheduleParameter_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncRS_ScheduleParameter" ADD FOREIGN KEY("ScheduleId") REFERENCES "SyncRS_Item" ("Id")
;
ALTER TABLE "SyncRS_ScheduleDetail" ADD "ExportFileSettingsInfo" VARCHAR2(4000) NULL
;
