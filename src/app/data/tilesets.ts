import { Tileset } from '@models/tileset';
/*
export const TILESETS: Array<Tileset> = [{
      id: '001-Grassland',
      src: './tilesets/001-Grassland.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image(),
      colliders: ['4-0', '1-9', '2-9', '8-0', '9-0', '10-0', '11-0', '12-0', '8-1', '9-1', '10-1', '11-1', '12-1', '0-15', '1-15', '2-15', '3-15', '4-15']
    }, {
      id: '002-Woods01',
      src: './tilesets/002-Woods01.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '003-Forest01',
      src: './tilesets/003-Forest01.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '004-Mountain01',
      src: './tilesets/004-Mountain01.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '005-Beach01',
      src: './tilesets/005-Beach01.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '006-Desert01',
      src: './tilesets/006-Desert01.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '007-Swamp01',
      src: './tilesets/007-Swamp01.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '008-Snowfield01',
      src: './tilesets/008-Snowfield01.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '009-CastleTown01',
      src: './tilesets/009-CastleTown01.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '010-CastleTown02',
      src: './tilesets/010-CastleTown02.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '011-PortTown01',
      src: './tilesets/011-PortTown01.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '012-PortTown02',
      src: './tilesets/012-PortTown02.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '013-PostTown01',
      src: './tilesets/013-PostTown01.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '014-PostTown02',
      src: './tilesets/014-PostTown02.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '015-ForestTown01',
      src: './tilesets/015-ForestTown01.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '016-ForestTown02',
      src: './tilesets/016-ForestTown02.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '017-MineTown01a',
      src: './tilesets/017-MineTown01a.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '017-MineTown01b',
      src: './tilesets/017-MineTown01b.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '018-MineTown02',
      src: './tilesets/018-MineTown02.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '019-DesertTown01',
      src: './tilesets/019-DesertTown01.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '020-DesertTown02',
      src: './tilesets/020-DesertTown02.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '021-SnowTown01a',
      src: './tilesets/021-SnowTown01a.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '021-SnowTown01b',
      src: './tilesets/021-SnowTown01b.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '022-SnowTown02',
      src: './tilesets/022-SnowTown02.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '023-FarmVillage01',
      src: './tilesets/023-FarmVillage01.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '024-FarmVillage02',
      src: './tilesets/024-FarmVillage02.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '025-Castle01',
      src: './tilesets/025-Castle01.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '026-Castle02',
      src: './tilesets/026-Castle02.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '027-Castle03',
      src: './tilesets/027-Castle03.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '028-Church01',
      src: './tilesets/028-Church01.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '029-Church02',
      src: './tilesets/029-Church02.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '030-Ship01a',
      src: './tilesets/030-Ship01a.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '030-Ship01b',
      src: './tilesets/030-Ship01b.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '031-Ship02',
      src: './tilesets/031-Ship02.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '032-Heaven01',
      src: './tilesets/032-Heaven01.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '033-Heaven02',
      src: './tilesets/033-Heaven02.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '034-Bridge01',
      src: './tilesets/034-Bridge01.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '035-Ruins01',
      src: './tilesets/035-Ruins01.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '036-Shop01a',
      src: './tilesets/036-Shop01a.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '036-Shop01b',
      src: './tilesets/036-Shop01b.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '037-Fort01',
      src: './tilesets/037-Fort01.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '038-Fort02',
      src: './tilesets/038-Fort02.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '039-Tower01',
      src: './tilesets/039-Tower01.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '040-Tower02',
      src: './tilesets/040-Tower02.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '041-EvilCastle01',
      src: './tilesets/041-EvilCastle01.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '042-EvilCastle02',
      src: './tilesets/042-EvilCastle02.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '043-Cave01',
      src: './tilesets/043-Cave01.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '044-Cave02',
      src: './tilesets/044-Cave02.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '045-Cave03',
      src: './tilesets/045-Cave03.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '046-Cave04',
      src: './tilesets/046-Cave04.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '047-Mine01',
      src: './tilesets/047-Mine01.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '048-Sewer01',
      src: './tilesets/048-Sewer01.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '049-InnerBody01',
      src: './tilesets/049-InnerBody01.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: '050-DarkSpace01',
      src: './tilesets/050-DarkSpace01.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: 'A1',
      src: './tilesets/A1.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: 'A2_inside',
      src: './tilesets/A2_inside.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: 'A2_outside',
      src: './tilesets/A2_outside.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: 'A4',
      src: './tilesets/A4.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: 'A5',
      src: './tilesets/A5.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: 'gameboy',
      src: './tilesets/gameboy.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    }, {
      id: 'sky',
      src: './tilesets/sky.png',
      width: 0,
      height: 0,
      screenWidth: 0,
      screenHeight: 0,
      tileSize: 48,
      img: new Image()
    },
];
*/
