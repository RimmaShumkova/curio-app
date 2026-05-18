// src/shared/machines/actors.ts
//
// Singleton акторы — создаются один раз при старте приложения.
// Импортируй нужный актор в любом компоненте через useActor().
//
// Для readingMachine НЕ используем singleton —
// он создаётся локально в StoryReaderPage через useMachine(),
// так как каждая сессия чтения независима.

import { createActor } from 'xstate';
import { authMachine } from './authMachine';
import { childMachine } from './childMachine';
import { storiesMachine } from './storiesMachine';

export const authActor = createActor(authMachine);
export const childActor = createActor(childMachine);
export const storiesActor = createActor(storiesMachine);

/**
 * Запускает все глобальные акторы.
 * Вызывается один раз в main.ts до createApp().
 *
 * authMachine и childMachine имеют начальное состояние 'checking'
 * с always-переходами — они разрешаются синхронно при старте,
 * поэтому к моменту монтирования Splash акторы уже в стабильном состоянии.
 */
export function startActors(): void {
  authActor.start();
  childActor.start();
  storiesActor.start();
}
