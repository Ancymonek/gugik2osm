delete from prg.delta_new
using (
    SELECT prg.lokalnyid
    FROM prg.delta prg
    JOIN osm_addr_polygon osm
        ON (st_dwithin(prg.geom, st_transform(osm.geometry, 2180), 5) AND (osm.name IS NOT NULL)) -- name = nr
) dd
where delta_new.lokalnyid = dd.lokalnyid;