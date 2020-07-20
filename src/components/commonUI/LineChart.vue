<template>
  <div
    class="line-chart"
    ref="lineChart"
  >
  </div>
</template>
<script>

import * as d3 from 'd3'
import * as d3SelectMulti from 'd3-selection-multi'

export default {
  name: 'lineChart',
  props: {
    data: {
      type: Array,
      required: true
    },
    xAxexField: {
      type: String,
      required: true
    },
    yAxexField: {
      type: String,
      required: true
    },
    range: {
      type: String,
      required: true
    },
    tooltipParse: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      svg: null,
      x: null,
      y: null,
      area: null,
      line: null,
      tooltipX: null,
      tooltipY: null,
      focus: null,
      periodInfo:'',
      margin: { top: 20, right: 60, bottom: 30, left: 15 },
      parseTime: d3.utcParse('%Y-%m-%dT%H:%M:%S%Z'),
      bisectDate: d3.bisector(d => d[this.xAxexField]).left,
      formatValue: d3.format(',.2f'),
      formatYTooltip: d3.timeFormat(this.tooltipParse),
      initialWidth: 1100
    }
  },
  computed: {
    parsedData () {
      if (this.data) {
        return this.data.map(d => {
          const item = {}
          item[this.xAxexField] = this.parseTime(d[this.xAxexField])
          item[this.yAxexField] = +d[this.yAxexField]
          return item
        })
      } else {
        return []
      }
    },
    sortedData () {
      const data = [...this.parsedData]
      return data.sort((a, b) => a[this.xAxexField] - b[this.xAxexField])
    },
    width () {
      return this.initialWidth - this.margin.left - this.margin.right
    },
    height () {
      return 185 - this.margin.top - this.margin.bottom
    }
  },
  methods: {
    setRange () {
      this.x = d3.scaleTime()
        .range([0, this.width])
      this.y = d3.scaleLinear()
        .range([this.height, 0])
    },
    setArea () {
      this.area = d3.area()
        .x(d => this.x(d[this.xAxexField]))
        .y0(this.height)
        .y1(d => this.y(d[this.yAxexField]))
    },
    setLine () {
      this.line = d3.line()
        .x(d => this.x(d[this.xAxexField]))
        .y(d => this.y(d[this.yAxexField]))
    },
    drawAxis () {
      this.svg.append('g')
        .attr('class', 'x axis axis--x')
        .attr('transform', `translate(0, ${(this.height + 5)})`)
        .call(d3.axisBottom(this.x)
          .ticks(this.getTicksCount())
          .tickFormat(d3.timeFormat(this.getAxisFormat())))
      this.svg.append('g')
        .attr('transform', 'translate(' + (this.width + 5) + ' ,0)')
        .attr('class', 'y axis axis--y')
        .call(d3.axisRight(this.y)
          .ticks(4))
        .append('text')
        .attr('class', 'axis-title')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
    },
    drawArea () {
      this.svg.append('path')
        .data([this.sortedData])
        .attr('class', 'area')
        .attr('d', this.area)
    },
    setDomains () {
      const yDomain = d3.extent(this.sortedData, d => d[this.yAxexField])
      if (this.range !== '1h') {
        yDomain[0] = yDomain[0] * 0.995
      }
      this.x.domain([this.sortedData[0][this.xAxexField], this.sortedData[this.sortedData.length - 1][this.xAxexField]])
      this.y.domain(yDomain)
    },
    setAxisStyle () {
      d3.selectAll('.axis path')
        .styles({
          display: 'none'
        })

      d3.selectAll('.axis line')
        .styles({
          display: 'none'
        })
    },
    mountCanvas () {
      this.svg = d3.select('.line-chart').append('svg')
        .attr('width', this.width + this.margin.left + this.margin.right)
        .attr('height', this.height + this.margin.top + this.margin.bottom)
        .append('g')
        .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
    },
    createTooltips () {
      this.tooltipX = d3.select('.line-chart')
        .append('span')
        .attr('class', 'tooltip')
        .style('opacity', 0)

      this.tooltipY = d3.select('.line-chart')
        .append('span')
        .attr('class', 'tooltip')
        .style('opacity', 0)
    },
    mountLine () {
      this.svg.append('path')
        .datum(this.sortedData)
        .attr('class', 'line')
        .attr('d', this.line)
    },
    createAndMountFocus () {
      this.focus = this.svg.append('g')
        .attr('class', 'focus')
        .style('display', 'none')

      this.focus.append('line')
        .classed('x', true)

      this.focus.append('line')
        .classed('y', true)

      this.focus.append('circle')
        .attr('r', 4.5)
        .styles({
          fill: '#fff',
          stroke: '#41464a',
          'stroke-width': '2px'
        })
    },
    mountOverlay () {
      this.svg.append('rect')
        .attr('class', 'overlay')
        .attr('width', this.width)
        .attr('height', this.height)
        .on('mouseover', () => {
          this.tooltipX.style('display', 'none')
          this.tooltipY.style('display', 'none')
          this.focus.style('display', null)
        })
        .on('mouseout', () => {
          this.tooltipX.style('display', 'none')
          this.tooltipY.style('display', 'none')
          this.focus.style('display', 'none')
        })
        .on('mousemove', mousemove)

      const that = this

      function mousemove () {
        const x0 = that.x.invert(d3.mouse(this)[0])
        const i = that.bisectDate(that.sortedData, x0, 1)
        const d0 = that.sortedData[i - 1]
        const d1 = that.sortedData[i]
        const d = x0 - d0[that.xAxexField] > d1[that.xAxexField] - x0 ? d1 : d0
        that.focus.attr('transform', `translate(${that.x(d[that.xAxexField])}, ${that.y(d[that.yAxexField])})`)
        that.focus.select('line.x')
          .attr('x1', 0)
          .attr('x2', that.width - that.x(d[that.xAxexField]))
          .attr('y1', 0)
          .attr('y2', 0)

        that.focus.select('line.y')
          .attr('x1', 0)
          .attr('x2', 0)
          .attr('y1', 0)
          .attr('y2', that.height - that.y(d[that.yAxexField]))

        that.tooltipX
          .html(that.formatYTooltip(d[that.xAxexField]))
          .styles({
            'font-size': '13px',
            opacity: 1,
            display: 'inline-block',
            padding: '10px 5px',
            'border-radius': '3px',
            background: '#41464a',
            color: '#fff',
            position: 'absolute',
            'line-height': '13px',
            transform: 'translate(-50%, 0)',
            'white-space': 'nowrap',
            top: `${(that.height + that.margin.top)}px`,
            left: `${(0 + that.x(d[that.xAxexField]) + that.margin.left)}px`
          })

        that.tooltipY
          .html(that.formatCurrency(d[that.yAxexField]))
          .styles({
            'font-size': '13px',
            'line-height': '13px',
            opacity: 1,
            display: 'inline-block',
            padding: '10px 5px',
            'border-radius': '3px',
            background: '#41464a',
            color: '#fff',
            position: 'absolute',
            transform: 'translate(0, -50%)',
            'white-space': 'nowrap',
            top: `${(that.y(d[that.yAxexField]) + that.margin.top)}px`,
            left: `${(that.width + that.margin.left)}px`
          })
      }
    },
    setChartStyles () {
      // border line
      this.svg.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', this.height)
        .styles({
          fill: 'none',
          stroke: '#97979720',
          'stroke-width': '1px'
        })

      d3.selectAll('.line')
        .styles({
          fill: 'none',
          stroke: '#41464a40',
          'stroke-width': '1.5px'
        })

      d3.select('.overlay')
        .styles({
          fill: 'none',
          'pointer-events': 'all'
        })

      d3.selectAll('.focus')
        .style('opacity', 1)

      d3.selectAll('.focus circle')
        .styles({
          fill: '#fff',
          stroke: 'black',
          'z-index': '3'
        })

      d3.selectAll('.focus line')
        .styles({
          fill: 'none',
          'stroke': '#41464a40',
          'stroke-width': '1.5px',
          'stroke-dasharray': '3 3'
        })
    },
    drawFirstTime () {
      this.setRange()
      this.setArea()
      this.setLine()
      this.mountCanvas()
      this.createTooltips()
      this.setDomains()
      this.drawArea()
      this.drawAxis()
      this.setAxisStyle()
      this.mountLine()
      this.createAndMountFocus()
      this.mountOverlay()
      this.setChartStyles()
    },
    updateChart () {
      this.setDomains()
      this.setLine()
      this.svg
        .select('.y.axis')
        .call(d3
          .axisRight(this.y)
          .ticks(4))
      this.svg
        .select('.x.axis')
        .call(d3
          .axisBottom(this.x)
          .ticks(this.getTicksCount())
          .tickFormat(d3.timeFormat(this.getAxisFormat())))

      this.setAxisStyle()

      this.svg
        .selectAll('path')
        .data([this.sortedData])
        .attr('d', this.area)
        .enter()
        .exit()
        .remove()

      this.svg
        .select('path.line')
        .data([this.sortedData])
        .attr('d', this.line)
        .enter()
        .exit()
        .remove()
    },
    formatCurrency (d) {
      return `${this.formatValue(d)}`
    },
    resizeChart () {
      if(this.$refs.lineChart){
        this.initialWidth = this.$refs.lineChart.clientWidth
      }
      this.setRange()
      d3.select('.line-chart svg')
        .attr('width', this.width + this.margin.left + this.margin.right)
      this.svg.select('rect')
        .attr('width', this.width)

      this.svg.select('g.y.axis.axis--y')
        .attr('transform', 'translate(' + (this.width + 5) + ' ,0)')

      this.svg.append('rect.overlay')
        .attr('width', this.width)
      this.updateChart()
    },
    setPeriodInfo () {
      switch (this.range) {
        case ('market_short_info.hour'): this.periodInfo = '1h'
          break
        case ('market_short_info.week'): this.periodInfo = '1w'
          break
        default: this.periodInfo = '24h'
          break
      }
    },
    getAxisFormat () {
      this.setPeriodInfo ()
      if (this.periodInfo === '1h') {
        return '%I:%M %p'
      } else if (this.periodInfo === '24h') {
        return '%I %p'
      } else {
        return '%d %b'
      }
    },
    getTicksCount () {
      if (this.data.length > 13) {
        return 13
      } else {
        return this.data.length
      }
    }
  },
  mounted () {
    this.drawFirstTime()
    d3.select(window).on('resize', this.resizeChart)
    this.initialWidth = this.$refs.lineChart.clientWidth

  },
  watch: {
    data () {
      this.formatYTooltip = d3.timeFormat(this.tooltipParse)
      this.updateChart()
    }
  }
}
</script>

<style>
  .line-chart{
    width: 100%;
    height: auto;
    display: flex;
    position: relative;
  }
  .line {
    fill: none;
    stroke: steelblue;
    stroke-width: 2px;
  }

  svg{
    overflow: visible;
  }

  .area {
    fill: #f6f6f6;
  }
  g.tick text {
    fill: #41464a50;
    font-size: 13px;
    font-family: "Avenir Next Cyr Medium", sans-serif;
  }
</style>
