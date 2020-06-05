select
   d.lokalnyid,
   d.teryt_msc,
   d.teryt_simc,
   d.teryt_ulica,
   d.teryt_ulic,
   d.nr,
   d.pna,
   st_x(st_transform(d.geom, 4326)) x4326,
   st_y(st_transform(d.geom, 4326)) y4326
from prg.delta d
left join exclude_prg on d.lokalnyid=exclude_prg.id
where d.geom && st_transform(ST_MakeEnvelope(%s, %s, %s, %s, 4326), 2180)
    and exclude_prg.id is null
limit 50000;
