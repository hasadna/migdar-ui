import dataflows as DF
import glob

x = DF.Flow(
    ({'filename': x[:-4]} for x in glob.glob('*png')),
    DF.update_resource(-1, name='files'),
    DF.load('http://api.yodaat.org/data/orgs_in_es/data/orgs.csv', name='orgs'),
    DF.join(
        'files', '{filename}',
        'orgs', '{entity_id}',
        {
            'filename': {},
        }, full=True, source_delete=True
    ),
    DF.filter_rows(lambda row: row['filename'] is None),
    DF.select_fields(['org_name', 'entity_id']),
    DF.printer()
).process()