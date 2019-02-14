ALTER TABLE SyncRS_ScheduleDetail ADD IsParameterEnabled smallint NOT NULL DEFAULT 0
;
CREATE TABLE SyncRS_ScheduleParameter(
Id SERIAL primary key NOT NULL,
ScheduleId uuid NOT NULL,
Parameter varchar(4000) NOT NULL,
IsActive smallint NOT NULL)
;

ALTER TABLE SyncRS_ScheduleParameter ADD FOREIGN KEY(ScheduleId) REFERENCES SyncRS_Item (Id)
;
ALTER TABLE SyncRS_ScheduleDetail ADD ExportFileSettingsInfo varchar(4000) NULL
;
