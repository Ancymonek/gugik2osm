select
    way_id,
    array_agg(ARRAY[cast(st_x((dp).geom) as numeric(10, 8)), cast(st_y((dp).geom) as numeric(10, 8))]) as arr
from (
    select row_number() over() * -1 - 100000 as way_id, ST_DumpPoints(geom) dp
    from prg.lod1_buildings
    where geom && ST_MakeEnvelope(%s, %s, %s, %s, 4326)
    limit 50000
) a
group by way_id;
