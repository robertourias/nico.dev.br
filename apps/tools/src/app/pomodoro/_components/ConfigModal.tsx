'use client';

import { useState } from 'react';
import { ITimerConfig } from '@/domain/pomodoro';
import { X } from 'lucide-react';
import { Button } from '@nico.dev/ui';

interface ConfigModalProps {
  config: ITimerConfig;
  isOpen: boolean;
  onSave: (config: ITimerConfig) => void;
  onCancel: () => void;
}

export function ConfigModal({ config, isOpen, onSave, onCancel }: ConfigModalProps) {
  const [formData, setFormData] = useState<ITimerConfig>(config);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof ITimerConfig, value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.workDuration <= 0) newErrors.workDuration = 'Deve ser maior que 0';
    if (formData.shortBreakDuration <= 0) newErrors.shortBreakDuration = 'Deve ser maior que 0';
    if (formData.longBreakInterval <= 0) newErrors.longBreakInterval = 'Deve ser maior que 0';
    if (formData.longBreakDuration <= 0) newErrors.longBreakDuration = 'Deve ser maior que 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md p-6 border border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Configurações</h2>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-accent rounded transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {/* Work Duration */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Duração do Trabalho (minutos)
            </label>
            <input
              type="number"
              value={formData.workDuration}
              onChange={(e) => handleChange('workDuration', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              min="1"
            />
            {errors.workDuration && <p className="text-xs text-red-500 mt-1">{errors.workDuration}</p>}
          </div>

          {/* Short Break Duration */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Duração da Pausa Curta (minutos)
            </label>
            <input
              type="number"
              value={formData.shortBreakDuration}
              onChange={(e) => handleChange('shortBreakDuration', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              min="1"
            />
            {errors.shortBreakDuration && (
              <p className="text-xs text-red-500 mt-1">{errors.shortBreakDuration}</p>
            )}
          </div>

          {/* Long Break Interval */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Ciclos antes da Pausa Longa
            </label>
            <input
              type="number"
              value={formData.longBreakInterval}
              onChange={(e) => handleChange('longBreakInterval', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              min="1"
            />
            {errors.longBreakInterval && (
              <p className="text-xs text-red-500 mt-1">{errors.longBreakInterval}</p>
            )}
          </div>

          {/* Long Break Duration */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Duração da Pausa Longa (minutos)
            </label>
            <input
              type="number"
              value={formData.longBreakDuration}
              onChange={(e) => handleChange('longBreakDuration', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              min="1"
            />
            {errors.longBreakDuration && (
              <p className="text-xs text-red-500 mt-1">{errors.longBreakDuration}</p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button onClick={onCancel} variant="outline" className="flex-1">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="flex-1">
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
}
