CREATE TABLE [SyncRS_EmailTemplate](
	[Id] [int] IDENTITY(1,1) primary key NOT NULL,
	[FileName] [nvarchar](255) NOT NULL,
	[Content] [text] NULL)
;
\ No newline at end of file