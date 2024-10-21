import { Routes } from '@angular/router';

export const routes: Routes = [
  {path: '', redirectTo: 'games', pathMatch: 'full'},
  {path: 'map-editor', children: [
    {path: '', loadComponent: () => import('@views/map-editor/map-editor.component').then(c => c.MapEditorComponent)},
    {path: 'play', loadComponent: () => import('@views/play/play.component').then(c => c.PlayComponent)}
  ]},
  {path: 'games', children: [
    {path: '', loadComponent: () => import('@views/game-list/game-list.component').then(c => c.GameListComponent)},
    {path: ':game-id', children: [
      {path: '', loadComponent: () => import('@views/game-detail/game-detail.component').then(c => c.GameDetailComponent)},
      {path: 'maps', children: [
        {path: ':map-id', children: [
          {path: '', loadComponent: () => import('@views/map-editor/map-editor.component').then(c => c.MapEditorComponent)},
          {path: 'play', loadComponent: () => import('@views/play/play.component').then(c => c.PlayComponent)}
        ]},
      ]},
      {path: 'play', loadComponent: () => import('@views/play/play.component').then(c => c.PlayComponent)}
    ]}
  ]}
];
