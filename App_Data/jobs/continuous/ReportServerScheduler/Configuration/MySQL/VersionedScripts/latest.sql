ALTER TABLE {database_name}.SyncRS_ScheduleDetail ADD IsParameterEnabled tinyint(1) NOT NULL DEFAULT 0
;
CREATE TABLE {database_name}.SyncRS_ScheduleParameter(
    Id int NOT NULL AUTO_INCREMENT,
	ScheduleId char(38) NOT NULL,
    Parameter varchar(4000) NOT NULL,
    IsActive tinyint(1) NOT NULL,
	PRIMARY KEY (Id))
;

ALTER TABLE {database_name}.SyncRS_ScheduleParameter  ADD FOREIGN KEY(ScheduleId) REFERENCES {database_name}.SyncRS_Item (Id)
;
ALTER TABLE {database_name}.SyncRS_ScheduleDetail  ADD ExportFileSettingsInfo varchar(4000) NULL
;
