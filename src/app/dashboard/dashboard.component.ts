import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import Notiflix from 'notiflix-angular';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';

import { AuthService, DecodedAccessToken } from '../auth/auth.service';
import { LandDto, PagedRes, ReqDto } from '../land/land.dto';
import { LandService } from '../land/land.service';
import { LocalStoreService } from '../shared/services/local-store.service';
import { NotifyService } from '../shared/services/notify.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  jwt: DecodedAccessToken;
  landsCount: number;
  landRequest$: Observable<PagedRes<ReqDto>>;
  monthlyPaidLands: LandDto[];
  revenueTotal = 0;
  isRemovingLand = false;
  lands$: Observable<PagedRes<LandDto>>;
  isContainsRent: boolean;
  constructor(
    private authService: AuthService,
    private landService: LandService,
    private localStore: LocalStoreService
  ) {
    this.jwt = this.authService.getDecodedAccessToken();
  }

  ngOnInit() {
    this.localStore.disableCaching();
    const currUser = this.jwt.user;
    const role = this.jwt.user.role;
    let query = {};
    if (role === 'Farmer') query = { occupant: currUser.userId };
    else if (role === 'Landowner') query = { createdBy: currUser.userId };

    this.lands$ = this.landService.getLands({ skip: 0, limit: 10 * 2, query }).pipe(share());
    this.landRequest$ = this.landService.getLandRequests({ skip: 0, limit: 10 * 2 * 10 }).pipe(share());

    this.lands$.subscribe(res => {
      this.landsCount = res.totalCount;
      const monthlyRevenue: any = {};
      const landLabels = [];
      const landSeries = [];
      const landPriceSeries = [];
      this.isContainsRent = !!res.items.find(x => x.auctionType === 'Rent');

      res.items.map((v, i) => {
        if (!v.isAvailable) this.revenueTotal += v.price;
        this.computeMonthlyRevenue(v, monthlyRevenue);
        landLabels.push(`L${i + 1}`);
        landSeries.push(v.requests.length);
        landPriceSeries.push(v.price);
      });
      this.initRevenueLineChart(monthlyRevenue);
      this.initRequestRateLineChart(landLabels, landSeries);
      this.initLandPricesLineChart(landLabels, landPriceSeries);
    });
  }

  onClickRemoveLandIcon(id: string) {
    Notiflix.Confirm.Init({
      okButtonBackground: '#e71c14',
      titleColor: '#ff0000',
      borderRadius: '10px',
      fontFamily: 'Roboto',
      useGoogleFont: true
    });
    Notiflix.Confirm.Show('Delete Land', 'Are you sure you want to delete this land?', 'Yes', 'No', () => {
      this.isRemovingLand = true;
      this.landService.deleteLand(id).subscribe(
        () => {
          // this.lands = this.lands.filter(v => v.id !== id);
          this.isRemovingLand = false;
          Notiflix.Loading.Remove();
          this.ngOnInit();
          NotifyService.notify({
            from: 'top',
            align: 'right',
            message: 'Land removed successfully',
            notifyType: 'success',
            icon: 'check',
            delay: 3
          });
        },
        () => (this.isRemovingLand = false)
      );
    });
  }
  startAnimationForLineChart(chart: Chartist.IChartistLineChart) {
    let seq: any, delays: any, durations: any;
    seq = 0;
    delays = 80;
    durations = 500;

    chart.on('draw', function (data) {
      if (data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === 'point') {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq = 0;
  }
  startAnimationForBarChart(chart: Chartist.IChartistBarChart) {
    let seq2: any, delays2: any, durations2: any;

    seq2 = 0;
    delays2 = 80;
    durations2 = 500;
    chart.on('draw', function (data) {
      if (data.type === 'bar') {
        seq2++;
        data.element.animate({
          opacity: {
            begin: seq2 * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq2 = 0;
  }
  private initLandPricesLineChart(labels: string[], priceSeries: number[]) {
    const max = Math.max(...priceSeries);
    const series = [];
    priceSeries.map(p => series.push((p * 100) / max));
    var dataLandPricesViewsChart = {
      labels,
      series: [series]
    };
    var optionsLandPricesViewsChart = {
      axisX: {
        showGrid: false
      },
      low: 0,
      high: 100,
      chartPadding: { top: 0, right: 5, bottom: 0, left: 0 }
    };
    var responsiveOptions: any[] = [
      [
        'screen and (max-width: 640px)',
        {
          seriesBarDistance: 5,
          axisX: {
            labelInterpolationFnc: (value: any[]) => value[0]
          }
        }
      ]
    ];
    var websiteViewsChart = new Chartist.Bar(
      '#websiteViewsChart',
      dataLandPricesViewsChart,
      optionsLandPricesViewsChart,
      responsiveOptions
    );

    //start animation for the Emails Subscription Chart
    this.startAnimationForBarChart(websiteViewsChart);
  }

  private initRequestRateLineChart(landLabels: any[], landSeries: any[]) {
    const dataCompletedTasksChart = {
      labels: landLabels,
      series: [landSeries]
    };
    const max = Math.max(...landSeries);
    const min = Math.min(...landSeries);
    const optionsCompletedTasksChart = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: min,
      high: max + max / 100,
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 }
    };
    const completedTasksChart = new Chartist.Line(
      '#completedTasksChart',
      dataCompletedTasksChart,
      optionsCompletedTasksChart
    );
    // start animation for the Completed Tasks Chart - Line Chart
    this.startAnimationForLineChart(completedTasksChart);
  }

  private computeMonthlyRevenue(v: LandDto, r: any) {
    if (new Date(v.updatedAt).getMonth() === 0 && !v.isAvailable) r.jan = r.jan ? r.jan + v.price : v.price;
    if (new Date(v.updatedAt).getMonth() === 1 && !v.isAvailable) r.feb = r.feb ? r.feb + v.price : v.price;
    if (new Date(v.updatedAt).getMonth() === 2 && !v.isAvailable) r.mar = r.mar ? r.mar + v.price : v.price;
    if (new Date(v.updatedAt).getMonth() === 3 && !v.isAvailable) r.apr = r.apr ? r.apr + v.price : v.price;
    if (new Date(v.updatedAt).getMonth() === 4 && !v.isAvailable) r.may = r.may ? r.may + v.price : v.price;
    if (new Date(v.updatedAt).getMonth() === 5 && !v.isAvailable) r.jun = r.jun ? r.jun + v.price : v.price;
    if (new Date(v.updatedAt).getMonth() === 6 && !v.isAvailable) r.jul = r.jul ? r.jul + v.price : v.price;
    if (new Date(v.updatedAt).getMonth() === 7 && !v.isAvailable) r.aug = r.aug ? r.aug + v.price : v.price;
    if (new Date(v.updatedAt).getMonth() === 8 && !v.isAvailable) r.sep = r.sep ? r.sep + v.price : v.price;
    if (new Date(v.updatedAt).getMonth() === 9 && !v.isAvailable) r.oct = r.oct ? r.oct + v.price : v.price;
    if (new Date(v.updatedAt).getMonth() === 10 && !v.isAvailable) r.nov = r.nov ? r.nov + v.price : v.price;
    if (new Date(v.updatedAt).getMonth() === 11 && !v.isAvailable) r.dec = r.dec ? r.dec + v.price : v.price;
  }

  private initRevenueLineChart(r: any) {
    const dataDailySalesChart: any = {
      labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      series: [
        [
          r.jan || 0,
          r.feb || 0,
          r.mar || 0,
          r.apr || 0,
          r.may || 0,
          r.jun || 0,
          r.jul || 0,
          r.aug || 0,
          r.sep || 0,
          r.oct || 0,
          r.nov || 0,
          r.dec || 0
        ]
      ]
    };
    const arr: number[] = Object.values(r);
    const max = Math.max(...arr);
    const min = Math.min(...arr);

    const optionsDailySalesChart = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: min,
      high: max + max / 100,
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 }
    };
    const dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);
    this.startAnimationForLineChart(dailySalesChart);
  }
}
