import { ConfigurableFormItem } from '@/components';
import { validateConfigurableComponentSettings } from '@/formDesignerUtils';
import { IToolboxComponent } from '@/interfaces';
import { RadarChartOutlined } from '@ant-design/icons';
import React from 'react';
import ChartDataProvider from '../../providers/chartData';
import ChartControl from './chartControl';
import ChartControlURL from './chartControlURL';
import { IChartProps } from './model';
import { getSettings } from './settingsFormIndividual';
import { defaultConfigFiller, defaultStyles, filterNonNull } from './utils';
import { removeUndefinedProps } from '@/utils/object';
import { migratePrevStyles } from '../_common-migrations/migrateStyles';
import { useFormEvaluatedFilter } from '@/providers/dataTable/filters/evaluateFilter';
import { useNestedPropertyMetadatAccessor } from '@/index';

const PolarAreaChartComponent: IToolboxComponent<IChartProps> = {
  type: 'polarAreaChart',
  name: 'Polar Area Chart',
  isInput: false,
  isOutput: true,
  icon: <RadarChartOutlined />,
  Factory: ({ model }) => {
    const propertyMetadataAccessor = useNestedPropertyMetadatAccessor(model.entityType);
    const evaluatedFilters = useFormEvaluatedFilter({ metadataAccessor: propertyMetadataAccessor, filter: model.filters });

    const {
      dimensionsStyles,
      borderStyles,
      backgroundStyles,
      shadowStyles,
      stylingBoxAsCSS,
      jsStyle
    } = model.allStyles;

    const wrapperStyles = removeUndefinedProps({
      ...dimensionsStyles,
      ...borderStyles,
      ...backgroundStyles,
      ...shadowStyles,
      ...stylingBoxAsCSS,
      ...jsStyle
    });

    if (model.hidden) return null;

    return (
      <ConfigurableFormItem model={model}>
        {() => {
          return (
            <ChartDataProvider model={model}>
              <div style={{
                ...wrapperStyles,
                padding: '16px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}>
                {model.dataMode === 'url' ? <ChartControlURL {...model} /> : <ChartControl chartType='polarArea' evaluatedFilters={evaluatedFilters} />}
              </div>
            </ChartDataProvider>
          );
        }}
      </ConfigurableFormItem>
    );
  },
  settingsFormMarkup: (data) => getSettings(data),
  validateSettings: (model) => validateConfigurableComponentSettings(getSettings(model), model),
  migrator: (m) => m
    .add<IChartProps>(0, prev => ({
      chartType: 'polarArea',
      showTitle: false,
      showLegend: true,
      legendPosition: 'top',
      hidden: false,
      ...prev,
    }))
    .add<IChartProps>(1, prev => ({ ...prev, hideLabel: true }))
    .add<IChartProps>(2, prev => ({ ...prev, showBorder: true }))
    .add<IChartProps>(3, prev => ({ ...prev, isDoughnut: false }))
    .add<IChartProps>(4, prev => ({ ...prev, showTitle: true }))
    .add<IChartProps>(5, prev => ({
      ...defaultConfigFiller,
      ...filterNonNull(prev),
      type: prev.type,
      id: prev.id
    }))
    .add<IChartProps>(6, prev => ({
      ...prev,
      isAxisTimeSeries: false,
      isGroupingTimeSeries: false,
      strokeColor: '#000000',
      strokeWidth: 1,
      maxResultCount: 10000,
      requestTimeout: 10000,
    }))
    .add<IChartProps>(7, prev => ({
      ...prev,
      timeSeriesFormat: 'month-year',
      groupingTimeSeriesFormat: 'month-year',
      ...migratePrevStyles(prev, defaultStyles())
    }))
    .add<IChartProps>(8, prev => ({
      ...prev,
      maxResultCount: 250,
      requestTimeout: 15000,
      orderDirection: 'asc',
    }))
};

export default PolarAreaChartComponent;
