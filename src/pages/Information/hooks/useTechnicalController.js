import { useMemo } from 'react';

// Auxiliar: Calcula médias e determina as badges com base nas regras de negócio
const calculateBadges = (items) => {
  if (!items || items.length === 0) {
    return { confidence: 0, verified: false, iaGen: true };
  }

  const hasNaoInformado = items.some((i) => !i.value || i.value === 'Não informado');
  const validItems = items.filter((i) => i.value && i.value !== 'Não informado');

  // Regra: Verificado se todos os itens válidos têm confiança > 90% e nenhum item falta
  const allAbove90 = validItems.length > 0 && validItems.every((i) => (i.confidence || 0) > 90);

  let avgConfidence = 0;
  if (validItems.length > 0) {
    const total = validItems.reduce((acc, curr) => acc + (curr.confidence || 0), 0);
    avgConfidence = Math.round(total / validItems.length);
  }

  return {
    iaGen: hasNaoInformado,
    verified: allAbove90 && !hasNaoInformado,
    confidence: avgConfidence,
  };
};

export function useTechnical(car) {
  const groups = useMemo(() => {
    if (!car) return [];

    const specs = car.specs || {};

    const createGroup = (key, title, specKeys) => {
      const items = specKeys.map(([label, k]) => ({ label, ...(specs[k] || {}) }));
      return { key, title, items, ...calculateBadges(items) };
    };

    const baseGroups = [
      createGroup('base', 'Dados Base', [
        ['Modelo', 'model'],
        ['Marca', 'brand'],
        ['Ano', 'year'],
        ['Modos de Condução', 'driveModes'],
      ]),
      createGroup('specs', 'Especificações', [
        ['Potência', 'power'],
        ['Torque', 'torque'],
        ['Potência RPM', 'powerRpm'],
        ['Torque RPM', 'torqueRpm'],
        ['Transmissão', 'transmission'],
        ['Tração', 'drivetrain'],
      ]),
      createGroup('consumption', 'Consumos', [
        ['Cidade', 'cityConsumption'],
        ['Estrada', 'highwayConsumption'],
      ]),
      createGroup('dimensions', 'Dimensões', [
        ['Comprimento', 'length'],
        ['Largura', 'width'],
        ['Altura', 'height'],
        ['Entre-Eixos', 'wheelbase'],
      ]),
      createGroup('tires', 'Pneus', [
        ['Tipo', 'tireType'],
        ['Aro', 'rim'],
        ['Largura', 'tireWidth'],
        ['Perfil', 'tireProfile'],
      ]),
      createGroup('extras', 'Extras', [
        ['Capacidade do Tanque', 'tankCapacity'],
        ['Tipo de Combustível', 'fuelType'],
        ['Capacidade de Carga', 'loadCapacity'],
        ['Capacidade de Reboque', 'towingCapacity'],
      ]),
    ];

    const sections = car.sections || {};
    const prepareSectionGroup = (key, title, itemsArray) => {
    const items = (itemsArray || []).map((texto) => ({
        label: null,
        value: texto,
        confidence: null,
        source: null,
    }));
    return { key, title, items, ...calculateBadges(items) };
    };

    return [
      ...baseGroups,
      prepareSectionGroup('performance', 'Performance', sections.performance),
      prepareSectionGroup('security', 'Segurança', sections.security),
      prepareSectionGroup('technology', 'Tecnologia', sections.technology),
      prepareSectionGroup('comfort', 'Conforto', sections.comfort),
    ];
  }, [car]);

  return { groups };
}