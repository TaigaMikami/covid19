import Vue, { PropType } from 'vue'
import { ChartData, ChartOptions } from 'chart.js'
import { Doughnut, Bar, Line, Pie, mixins } from 'vue-chartjs'
import { Plugin } from '@nuxt/types'
import { useDayjsAdapter } from './chartjs-adapter-dayjs'

type ChartVCData = { chartData: ChartData }
type ChartVCMethod = {
  renderChart(chartData: ChartData, options: ChartOptions): void
}
type ChartVCComputed = unknown
type ChartVCProps = { options: Object }

const VueChartPlugin: Plugin = ({ app }) => {
  useDayjsAdapter(app.i18n)
  createCustomChart()
}

const createCustomChart = () => {
  const { reactiveProp } = mixins

  Vue.component<ChartVCData, ChartVCMethod, ChartVCComputed, ChartVCProps>(
    'doughnut-chart',
    {
      extends: Doughnut,
      mixins: [reactiveProp],
      props: {
        options: {
          type: Object as PropType<ChartOptions>,
          default: () => {}
        }
      },
      mounted(): void {
        this.renderChart(this.chartData, this.options)
      }
    }
  )

  Vue.component<ChartVCData, ChartVCMethod, ChartVCComputed, ChartVCProps>(
    'bar',
    {
      extends: Bar,
      mixins: [reactiveProp],
      props: {
        options: {
          type: Object,
          default: () => {}
        }
      },
      mounted(): void {
        this.renderChart(this.chartData, this.options)
      }
    }
  )

  Vue.component<ChartVCData, ChartVCMethod, ChartVCComputed, ChartVCProps>(
    'line-chart',
    {
      extends: Line,
      mixins: [reactiveProp],
      props: {
        options: {
          type: Object,
          default: () => {}
        }
      },
      mounted(): void {
        this.renderChart(this.chartData, this.options)
      }
    }
  )

  Vue.component<ChartVCData, ChartVCMethod, ChartVCComputed, ChartVCProps>(
    'pie-chart',
    {
      extends: Pie,
      mixins: [reactiveProp],
      props: {
        options: {
          type: Object as PropType<ChartOptions>,
          default: () => {}
        }
      },
      mounted(): void {
        this.renderChart(this.chartData, this.options)
      }
    }
  )
}

export default VueChartPlugin

export const scrollPlugin: Chart.PluginServiceRegistrationOptions[] = [
  {
    beforeInit(chartInstance) {
      const fn = () => {
        if (
          chartInstance &&
          chartInstance.canvas &&
          chartInstance.canvas.parentElement
        ) {
          chartInstance.canvas.parentElement.scrollLeft! = chartInstance.width!
        }
      }
      window.addEventListener('resize', fn)
      fn()
    }
  }
]

const rgba0 = 'rgba(255,255,255,0)'
const rgba1 = 'rgba(255,255,255,1)'
export const yAxesBgPlugin: Chart.PluginServiceRegistrationOptions[] = [
  {
    beforeDraw(chartInstance) {
      const ctx = chartInstance.ctx as CanvasRenderingContext2D

      // プロットエリアマスク用
      ctx.fillStyle = '#fff'
      ctx.fillRect(
        0,
        0,
        chartInstance.chartArea.left,
        chartInstance.chartArea.bottom + 1
      )

      // 横軸マスク用
      const gradient = ctx.createLinearGradient(
        0,
        0,
        chartInstance.chartArea.left,
        0
      )
      gradient.addColorStop(0, rgba1)
      gradient.addColorStop(1, rgba0)
      ctx.fillStyle = gradient
      ctx.fillRect(
        0,
        chartInstance.chartArea.bottom + 1,
        chartInstance.chartArea.left,
        (chartInstance.height as number) - chartInstance.chartArea.bottom - 1
      )
    }
  }
]

export interface DataSets<T = number> extends ChartData {
  data: T[]
}

export interface DisplayData<T = number, U = string> {
  labels?: U[]
  datasets: DataSets<T>[]
}
