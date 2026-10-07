import { useMemo } from 'react';

export function useTechnical(car) {
  const groups = useMemo(() => {
    if (!car) return [];

    const specs = car.specs || {};

    const createGroup = (key, title, specKeys) => {
      const items = specKeys.map(([label, k]) => ({ label, ...(specs[k] || {}) }));
      return { key, title, items };
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
      const items = (itemsArray || []).map((item) => {
        if (item && typeof item === "object") {
          return {
            ...item,
            label: null,
            value: item.value ?? item.valor ?? "",
            confidence: item.confidence ?? 0,
            source: item.source ?? item.fonte ?? null,
          };
        }
        return { label: null, value: item, confidence: null, source: null };
      });

      return { key, title, items };
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