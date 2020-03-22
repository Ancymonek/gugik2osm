insert into tiles (mvt, z, x, y, bbox)
    with
    a as (
        select distinct teryt_simc, coalesce(teryt_ulic, '99999') teryt_ulic
        from prg.delta d
        where d.geom && ST_Transform(ST_MakeEnvelope(%(xmin)s, %(ymin)s, %(xmax)s, %(ymax)s, 3857), 2180)
    ),
    b as (
        select
            ST_AsMVTGeom(
                ST_Transform(ST_GeometricMedian(st_union(d.geom)), 3857),
                ST_MakeEnvelope(%(xmin)s, %(ymin)s, %(xmax)s, %(ymax)s, 3857)::box2d
            ) geom
            , count(*) no_of_points
        from a
        join prg.delta d on a.teryt_simc=d.teryt_simc and a.teryt_ulic=coalesce(d.teryt_ulic, '99999')
        group by a.teryt_simc, a.teryt_ulic
    )
    select
        ST_AsMVT(b.*, 'prg2load_geomonly') mvt,
        %(z)s z,
        %(x)s x,
        %(y)s y,
        ST_MakeEnvelope(%(xmin)s, %(ymin)s, %(xmax)s, %(ymax)s, 3857) bbox
    from b
returning mvt
;
