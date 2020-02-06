export function denormalizeModel(
  data,
  modelName,
  modelIdAttr,
  joinModel,
  joinedModel,
  joinedModelIdAttr,
  relationKey = joinedModel
) {
  const denormalizedModels = Object.keys(data[modelName]).reduce(
    (modelAccumulator, modelId) => {
      const oldModels = data[modelName][modelId];
      const relation = Object.keys(data[joinModel] || {}).reduce(
        (joinedModelAcc, joinModelKey) => {
          if (data[joinModel][joinModelKey][modelIdAttr] == modelId) {
            const joinedModelId =
              data[joinModel][joinModelKey][joinedModelIdAttr];
            const joinedModelData = data[joinedModel][joinedModelId];
            if (joinedModelData) {
              joinedModelAcc[joinedModelId] = data[joinedModel][joinedModelId];
            } else {
              console.log(`Skipping ${joinedModel} - ${joinedModelId}`);
            }
          }

          return joinedModelAcc;
        },
        {}
      );

      modelAccumulator[modelId] = { ...oldModels, [relationKey]: relation };

      return modelAccumulator;
    },
    {}
  );
  return { ...data, [modelName]: denormalizedModels };
}
