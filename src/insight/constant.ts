import { ModelEnum } from 'fluentsearch-types';

export const INIT_ML: { model: ModelEnum; payload: Record<string, any> }[] = [
  {
    model: ModelEnum.ilsvrc_googlenet,
    payload: {
      description: 'image classification service',
      model: {
        repository: '/opt/models/ilsvrc_googlenet',
        init: 'https://deepdetect.com/models/init/desktop/images/classification/ilsvrc_googlenet.tar.gz',
        create_repository: true,
      },
      mllib: 'caffe',
      type: 'supervised',
      parameters: {
        input: {
          connector: 'image',
        },
      },
    },
  },
  {
    model: ModelEnum.detection_600,
    payload: {
      description: 'object detection service',
      model: {
        repository: '/opt/models/detection_600',
        create_repository: true,
        init: 'https://deepdetect.com/models/init/desktop/images/detection/detection_600.tar.gz',
      },
      parameters: { input: { connector: 'image' } },
      mllib: 'caffe',
      type: 'supervised',
    },
  },
  {
    model: ModelEnum.classification_21k,
    payload: {
      description: 'generic image classification service',
      model: {
        repository: '/opt/models/classification_21k',
        init: 'https://deepdetect.com/models/init/desktop/images/classification/classification_21k.tar.gz',
        create_repository: true,
      },
      mllib: 'caffe',
      type: 'supervised',
      parameters: {
        input: {
          connector: 'image',
        },
      },
    },
  },
  {
    model: ModelEnum.places,
    payload: {
      description: 'places classification service',
      model: {
        repository: '/opt/models/places',
        create_repository: true,
        init: 'https://deepdetect.com/models/init/desktop/images/classification/places.tar.gz',
      },
      mllib: 'caffe',
      type: 'supervised',
      parameters: {
        input: {
          connector: 'image',
        },
      },
    },
  },
];
