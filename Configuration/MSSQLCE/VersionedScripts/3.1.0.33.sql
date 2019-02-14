ALTER TABLE [SyncRS_ScheduleDetail] ADD [IsParameterEnabled] [bit] NOT NULL DEFAULT 0
;
CREATE TABLE [SyncRS_ScheduleParameter](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[ScheduleId] [uniqueidentifier] NOT NULL,
	[Parameter] nvarchar(4000) NOT NULL,
	[IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncRS_ScheduleParameter] ADD FOREIGN KEY([ScheduleId]) REFERENCES [SyncRS_Item] ([Id])
;
ALTER TABLE [SyncRS_ScheduleDetail] ADD [ExportFileSettingsInfo] [nvarchar](4000) NULL
;

