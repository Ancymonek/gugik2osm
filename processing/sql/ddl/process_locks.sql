create table if not exists process_locks (
  process_name text primary key,
  in_progress boolean not null
);

alter table process_locks add column if not exists start_time timestamp with time zone;
alter table process_locks add column if not exists end_time timestamp with time zone;
alter table process_locks add column if not exists last_status text;
alter table process_locks add column if not exists pretty_name text;

insert into process_locks values ('prg_full_update', false, null, null, null, 'Cotygodniowa aktualizacja danych PRG') on conflict do nothing;
insert into process_locks values ('prg_partial_update', false, null, null, null, 'Cominutowa aktualizacja danych OSM') on conflict do nothing;
insert into process_locks values ('teryt_update', false, null, null, null, 'Codzienna aktualizacja danych TERYT') on conflict do nothing;
