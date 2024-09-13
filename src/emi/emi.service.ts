import { BadRequestException, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { EmiCalculationDto } from './dtos/emi-calculation.dto';

@Injectable()
export class EmiService {
  /// EMI calculation test
  async emiCalculationTest(body: EmiCalculationDto) {
    try {
      // taking disbursement date from body
      const disbursementDate = moment(body.loan_disbursement_date);
      console.log('disbursementDate: ', disbursementDate);

      // taking tenure from body
      const tenure = body.tenure;
      console.log('tenure: ', tenure);

      // taking basic principal amount from body
      const basic_principal_amount = body.basic_principal_amount;
      console.log('basic_principal_amount: ', basic_principal_amount);

      // transfering basic principal amount to temp variable
      let temp_basic_principal_amount = basic_principal_amount;

      // assigning default interest rate from const file
      const interest_rate = body.interest_rate;
      console.log('interest_rate: ', interest_rate);

      // declaring variables
      let total_days_in_emi = 0;
      let total_days_in_year = 0;
      let effective_principal_amount_total = 0;

      // this will be the total of (EMIs * tenure)
      let total_repayble_amount = 0.0;

      // this will be total intetrest payable amount
      let total_interest_payable = 0;

      // taking salary cycle from body
      const salaryCycle = moment(body.salary_cycle_date);

      // const year_start_date = moment(salaryCycle).format();
      // console.log("full_start_month_date", year_start_date);
      // const year_end_date = moment(
      //   year_start_date,
      //   "YYYY-MM-DDTHH:mm:ss.SSSZ"
      // ).add(1, "year");
      // console.log("year_end_date", year_end_date);
      // total_days_in_year = year_end_date.diff(year_start_date, "days");
      // console.log("total_days_in_year", total_days_in_year);
      const diff = salaryCycle.diff(disbursementDate, 'days');
      console.log('difference in days: ', diff);

      // declaring an EMI array
      const emiArray = [];

      if (diff > 0) {
        // year strart date
        const year_start_date = moment(salaryCycle)
          .subtract(1, 'month')
          .format();
        console.log('full_start_month_date', year_start_date);

        // year end date
        const year_end_date = moment(
          year_start_date,
          'YYYY-MM-DDTHH:mm:ss.SSSZ',
        ).add(1, 'year');
        console.log('year_end_date', year_end_date);

        // total days in a year
        total_days_in_year = year_end_date.diff(year_start_date, 'days');
        console.log('total_days_in_year', total_days_in_year);

        // declaring from date from disbursement date
        let fromDate = moment(disbursementDate).format();
        console.log('fromDate: ', fromDate);

        // initialising loop
        for (let i = 0; i < tenure; i++) {
          const toDate = moment(salaryCycle).add(i, 'months').format();
          const obj = {
            from_date: fromDate,
            to_date: toDate,
            // str_month: moment(toDate).subtract(1, "month").format("MMM YYYY"),
            str_month: moment(toDate).format('DD-MMM-YYYY'),
            no_of_days_for_interest_calc: moment(
              toDate,
              'YYYY-MM-DDTHH:mm:ss.SSSZ',
            ).diff(moment(fromDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ'), 'days'),
          };
          total_days_in_emi += obj.no_of_days_for_interest_calc;
          emiArray.push(obj);
          fromDate = toDate;
        }
      } else {
        // year strart date
        const year_start_date = moment(salaryCycle).format();
        console.log('full_start_month_date', year_start_date);

        // year end date
        const year_end_date = moment(
          year_start_date,
          'YYYY-MM-DDTHH:mm:ss.SSSZ',
        ).add(1, 'year');
        console.log('year_end_date', year_end_date);

        // total days in a year
        total_days_in_year = year_end_date.diff(year_start_date, 'days');
        console.log('total_days_in_year', total_days_in_year);

        // declaring from date from disbursement date
        let fromDate = moment(disbursementDate).format();

        // initialising loop
        for (let i = 1; i <= tenure; i++) {
          const toDate = moment(salaryCycle).add(i, 'months').format();
          const obj = {
            from_date: fromDate,
            to_date: toDate,
            // str_month: moment(fromDate).format("MMM YYYY"),
            str_month: moment(toDate).format('DD-MMM-YYYY'),
            no_of_days_for_interest_calc: moment(
              toDate,
              'YYYY-MM-DDTHH:mm:ss.SSSZ',
            ).diff(moment(fromDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ'), 'days'),
          };
          total_days_in_emi += obj.no_of_days_for_interest_calc;
          emiArray.push(obj);
          fromDate = toDate;
        }
      }

      // finding per day principal
      const per_day_principal = basic_principal_amount / total_days_in_emi;
      console.log('per_day_principal: ', per_day_principal);

      // finding per day interest
      const per_day_interest = interest_rate / 100 / total_days_in_year;
      console.log('per_day_interest: ', per_day_interest);

      // pushing principal_amount to an array
      emiArray.forEach((e, i) => {
        emiArray[i] = {
          ...e,
          principal_amount: +(
            e.no_of_days_for_interest_calc * per_day_principal
          ).toFixed(2),
        };
      });

      // pushing balance amount and interest amount into an array
      emiArray.forEach((e, i) => {
        emiArray[i] = {
          ...e,
          // balance_amount: parseFloat(
          //   (
          //     temp_basic_principal_amount -
          //     parseFloat(
          //       (e.no_of_days_for_interest_calc * per_day_principal).toFixed(2)
          //     )
          //   ).toFixed(2)
          // ),
          interest_amount: parseFloat(
            (
              e.no_of_days_for_interest_calc *
              temp_basic_principal_amount *
              per_day_interest
            ).toFixed(2),
          ),
        };

        temp_basic_principal_amount = parseFloat(
          (temp_basic_principal_amount - e.principal_amount).toFixed(2),
        );
      });

      // totalling principal payable amount
      const total_principal_payable = +emiArray
        .reduce((sum, element) => sum + parseFloat(element.principal_amount), 0)
        .toFixed(2);
      console.log('total_principal_payable: ', total_principal_payable);

      // totalling interest payable amount
      total_interest_payable = +emiArray
        .reduce((sum, element) => sum + parseFloat(element.interest_amount), 0)
        .toFixed(2);
      console.log('total_interest_payable: ', total_interest_payable);

      // total_repayble_amount = +(
      //   total_principal_payable + total_interest_payable
      // ).toFixed(2);
      // console.log("total_repayble_amount: ", total_repayble_amount);

      // finding EMIs for particular tenure
      const emi = parseFloat(
        ((total_principal_payable + total_interest_payable) / tenure).toFixed(
          2,
        ),
      );
      console.log('emi', emi);

      // pushing an EMIs to an array
      emiArray.forEach((e, i) => {
        emiArray[i] = {
          ...e,
          emi,
        };
      });

      // totalling EMIs for total_repayable_amount
      total_repayble_amount = +emiArray
        .reduce((sum, element) => sum + parseFloat(element.emi), 0)
        .toFixed(2);
      console.log('total_repayble_amount: ', total_repayble_amount);

      // effective principal amount
      emiArray.forEach((e, i) => {
        emiArray[i] = {
          ...e,
          effective_principal_amount: +(e.emi - e.interest_amount).toFixed(2),
        };
      });

      // totalling effective_principal_amount till (last-1) index
      emiArray.map((e, i) => {
        if (i < tenure - 1) {
          +(effective_principal_amount_total +=
            e.effective_principal_amount).toFixed(2);
        }
        return e;
      });

      // changing last effective principal amount
      // removing last index of effective principal amount and swap with new round value
      emiArray.forEach((e, i) => {
        if (i === tenure - 1) {
          emiArray[i] = {
            ...e,
            effective_principal_amount: +(
              basic_principal_amount - effective_principal_amount_total
            ).toFixed(2),
            interest_amount: +(
              e.emi -
              (basic_principal_amount - effective_principal_amount_total)
            ).toFixed(2),
          };
        }
      });

      // assigning basic principal amount to temp vasic principal amount for balance calculation
      temp_basic_principal_amount = basic_principal_amount;
      console.log('temp_basic_principal_amount: ', temp_basic_principal_amount);

      // totalling & finding new effective principal amount total
      effective_principal_amount_total = +emiArray
        .reduce(
          (sum, element) =>
            sum + parseFloat(element.effective_principal_amount),
          0,
        )
        .toFixed(2);
      console.log(
        'effective_principal_amount_total: ',
        effective_principal_amount_total,
      );

      // declaring balance payable from effective principal amount
      emiArray.forEach((e, i) => {
        emiArray[i] = {
          ...e,
          balance_amount: +(
            temp_basic_principal_amount - e.effective_principal_amount
          ).toFixed(2),
        };
        temp_basic_principal_amount =
          temp_basic_principal_amount - e.effective_principal_amount;
      });

      // final total interest payable amount after all adjustment
      total_interest_payable = +emiArray
        .reduce((sum, element) => sum + parseFloat(element.interest_amount), 0)
        .toFixed(2);
      console.log('total_interest_payable: ', total_interest_payable);

      console.table(emiArray);

      /// api response
      const returnObj = {
        tenure,
        basic_principal_amount,
        interest_rate,
        total_days_in_emi,
        total_days_in_year,
        per_day_principal,
        per_day_interest,
        total_repayble_amount,
        effective_principal_amount_total,
        emi_amount: emi,
        total_interest_payable,
        emi: emiArray,
      };

      // on success response
      return returnObj;
    } catch (error) {
      console.log('error: ', error);
      throw new BadRequestException(error?.message);
    }
  }
}
