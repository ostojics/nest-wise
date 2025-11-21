import {createRouter} from '@tanstack/react-router';
import {routeTree} from './routeTree.gen';
import {DefaultErrorComponent} from '@/components/error-boundary';

export const router = createRouter({
  routeTree,
  context: {isAuthenticated: false},
  defaultErrorComponent: DefaultErrorComponent,
});
