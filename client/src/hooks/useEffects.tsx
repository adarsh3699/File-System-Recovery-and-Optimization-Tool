import { useState, useCallback } from 'react';
import { SparkleEffect } from '../components/effects/SparkleEffect';
import { ExplosionEffect } from '../components/effects/ExplosionEffect';

export type EffectType = 'sparkle' | 'explosion';

interface Effect {
  id: string;
  type: EffectType;
  x: number;
  y: number;
}

export function useEffects() {
  const [effects, setEffects] = useState<Effect[]>([]);

  const addEffect = useCallback((type: EffectType, x: number, y: number) => {
    const id = `${type}-${Date.now()}-${Math.random()}`;
    setEffects((prev) => [...prev, { id, type, x, y }]);
  }, []);

  const removeEffect = useCallback((id: string) => {
    setEffects((prev) => prev.filter((effect) => effect.id !== id));
  }, []);

  const renderEffects = useCallback(() => {
    return effects.map((effect) => {
      const Component = effect.type === 'sparkle' ? SparkleEffect : ExplosionEffect;
      return (
        <Component
          key={effect.id}
          x={effect.x}
          y={effect.y}
          onComplete={() => removeEffect(effect.id)}
        />
      );
    });
  }, [effects, removeEffect]);

  return {
    addEffect,
    renderEffects,
  };
}

