import { Component, OnInit } from "@angular/core";
import { PagedRes } from "@shared/DTOs/paged-response.dto";
import { LocalStoreService } from "@shared/services/local-store.service";
import { Toast } from "@shared/services/toast";
import * as Chartist from "chartist";
import Notiflix from "notiflix-angular";
import { Observable } from "rxjs";
import { share, tap } from "rxjs/operators";

import { AuthService, CurrentUser } from "../auth/auth.service";
import { LandReqDto, LandStatus } from "../land/DTOs/land-request.dto";
import { LandDto } from "../land/DTOs/land.dto";
import { LandService } from "../land/land.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  currentUser: CurrentUser;
  LandStatus = LandStatus;
  landRequest$: Observable<PagedRes<LandReqDto>>;
  monthlyPaidLands: LandDto[];
  isRemovingLand = false;
  lands$: Observable<PagedRes<LandDto>>;
  isContainsRent: boolean;
  cachedPagedLandDto: PagedRes<LandDto>;
  constructor(
    private authService: AuthService,
    private landService: LandService,
    private localStore: LocalStoreService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit() {
    this.localStore.disableCaching();
    const role = this.currentUser?.role;
    let query = {};
    let countQuery = {};

    if (role === "Farmer") {
      query = { occupant: this.currentUser.userId };
      countQuery = query;
      this.landRequest$ = this.landService.getFarmerRequests({ skip: 0, limit: 10 * 2 * 10 }).pipe(share());
    } else if (role === "Landowner") {
      query = { createdBy: this.currentUser.userId };
      countQuery = query;
      this.landRequest$ = this.landService.getRequestsToLandowner({ skip: 0, limit: 10 * 2 * 10 }).pipe(share());
    }

    this.lands$ = this.landService.getLands({ skip: 0, limit: 10 * 2, query, countQuery }).pipe(
      share(),
      tap(res => {
        this.cachedPagedLandDto = res;
        if (role !== "Farmer") this.initCharts();
      })
    );
  }

  calculateTotalRevenue(req: LandReqDto[]) {
    const mapped = this.getFarmerOccupancyArray(req).map(x => x.landId.price);
    return mapped.length ? mapped.reduce((x, y) => x + y) : 0;
  }
  onClickRemoveLandIcon(id: string) {
    Notiflix.Confirm.Init({
      okButtonBackground: "#e71c14",
      titleColor: "#ff0000",
      borderRadius: "10px",
      fontFamily: "Roboto",
      useGoogleFont: true
    });
    Notiflix.Confirm.Show("Delete Land", "Are you sure you want to delete this land?", "Yes", "No", () => {
      this.isRemovingLand = true;
      this.landService
        .deleteLand(id)
        .pipe(
          tap(() => {
            this.isRemovingLand = false;
            this.cachedPagedLandDto.items = this.cachedPagedLandDto.items.filter(v => v.id !== id);
            this.initCharts();
          })
        )
        .subscribe(
          () => {
            Notiflix.Loading.Remove();
            Toast.notify({
              from: "top",
              align: "right",
              message: "Land removed successfully",
              notifyType: "success",
              icon: "check",
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

    chart.on("draw", function (data) {
      if (data.type === "line" || data.type === "area") {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === "point") {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: "ease"
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
    chart.on("draw", (data: any) => {
      if (data.type === "bar") {
        seq2++;
        data.element.animate({
          opacity: {
            begin: seq2 * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: "ease"
          }
        });
      }
    });

    seq2 = 0;
  }
  getLandCountRentedOut(lands: LandDto[]) {
    return lands?.filter(x => x.status === LandStatus.Occupied).length;
  }
  getFarmerOccupancyArray(reqs?: LandReqDto[]) {
    return reqs?.filter(x => x.landId.status === LandStatus.Occupied);
  }
  private initCharts() {
    const monthlyRevenue: any = {};
    const landLabels = [];
    const landSeries = [];
    const landPriceSeries = [];
    const res = this.cachedPagedLandDto;
    this.isContainsRent = !!res.items.find(x => x.auctionType === "Rent");
    res.items.map((v, i) => {
      this.computeMonthlyRevenue(v, monthlyRevenue);
      landLabels.push(`L${i + 1}`);
      landSeries.push(v.requests.length);
      landPriceSeries.push(v.price);
    });
    this.initRevenueLineChart(monthlyRevenue);
    this.initRequestRateLineChart(landLabels, landSeries);
    this.initLandPricesLineChart(landLabels, landPriceSeries);
  }
  private initLandPricesLineChart(labels: string[], priceSeries: number[]) {
    const max = Math.max(...priceSeries);
    const series = [];
    priceSeries.map(p => series.push((p * 100) / max));
    const dataLandPricesViewsChart = {
      labels,
      series: [series]
    };
    const optionsLandPricesViewsChart = {
      axisX: {
        showGrid: false
      },
      low: 0,
      high: 100,
      chartPadding: { top: 0, right: 5, bottom: 0, left: 0 }
    };
    const responsiveOptions: any[] = [
      [
        "screen and (max-width: 640px)",
        {
          seriesBarDistance: 5,
          axisX: {
            labelInterpolationFnc: (value: any[]) => value[0]
          }
        }
      ]
    ];
    const websiteViewsChart = new Chartist.Bar(
      "#websiteViewsChart",
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
    // const min = Math.min(...landSeries);
    const optionsCompletedTasksChart = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: max + max / 100,
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 }
    };
    const completedTasksChart = new Chartist.Line(
      "#completedTasksChart",
      dataCompletedTasksChart,
      optionsCompletedTasksChart
    );
    // start animation for the Completed Tasks Chart - Line Chart
    this.startAnimationForLineChart(completedTasksChart);
  }

  private computeMonthlyRevenue(v: LandDto, r: any) {
    if (new Date(v.updatedAt).getMonth() === 0 && v.status === LandStatus.Occupied)
      r.jan = r.jan ? r.jan + v.price : v.price;
    if (new Date(v.updatedAt).getMonth() === 1 && v.status === LandStatus.Occupied)
      r.feb = r.feb ? r.feb + v.price : v.price;
    if (new Date(v.updatedAt).getMonth() === 2 && v.status === LandStatus.Occupied)
      r.mar = r.mar ? r.mar + v.price : v.price;
    if (new Date(v.updatedAt).getMonth() === 3 && v.status === LandStatus.Occupied)
      r.apr = r.apr ? r.apr + v.price : v.price;
    if (new Date(v.updatedAt).getMonth() === 4 && v.status === LandStatus.Occupied)
      r.may = r.may ? r.may + v.price : v.price;
    if (new Date(v.updatedAt).getMonth() === 5 && v.status === LandStatus.Occupied)
      r.jun = r.jun ? r.jun + v.price : v.price;
    if (new Date(v.updatedAt).getMonth() === 6 && v.status === LandStatus.Occupied)
      r.jul = r.jul ? r.jul + v.price : v.price;
    if (new Date(v.updatedAt).getMonth() === 7 && v.status === LandStatus.Occupied)
      r.aug = r.aug ? r.aug + v.price : v.price;
    if (new Date(v.updatedAt).getMonth() === 8 && v.status === LandStatus.Occupied)
      r.sep = r.sep ? r.sep + v.price : v.price;
    if (new Date(v.updatedAt).getMonth() === 9 && v.status === LandStatus.Occupied)
      r.oct = r.oct ? r.oct + v.price : v.price;
    if (new Date(v.updatedAt).getMonth() === 10 && v.status === LandStatus.Occupied)
      r.nov = r.nov ? r.nov + v.price : v.price;
    if (new Date(v.updatedAt).getMonth() === 11 && v.status === LandStatus.Occupied)
      r.dec = r.dec ? r.dec + v.price : v.price;
  }
  private getPercentage(val: number, max: number) {
    return ((val || 0) * 100) / max;
  }
  private initRevenueLineChart(r: any) {
    const arr: number[] = Object.values(r);
    const max = Math.max(...arr);
    const dataDailySalesChart: any = {
      labels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
      series: [
        [
          this.getPercentage(r.jan, max),
          this.getPercentage(r.feb, max),
          this.getPercentage(r.mar, max),
          this.getPercentage(r.apr, max),
          this.getPercentage(r.may, max),
          this.getPercentage(r.jun, max),
          this.getPercentage(r.jul, max),
          this.getPercentage(r.aug, max),
          this.getPercentage(r.sep, max),
          this.getPercentage(r.oct, max),
          this.getPercentage(r.nov, max),
          this.getPercentage(r.dec, max)
        ]
      ]
    };
    //const min = Math.min(...arr);

    const optionsDailySalesChart = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: 100,
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 }
    };
    const dailySalesChart = new Chartist.Line("#dailySalesChart", dataDailySalesChart, optionsDailySalesChart);
    this.startAnimationForLineChart(dailySalesChart);
  }
}
