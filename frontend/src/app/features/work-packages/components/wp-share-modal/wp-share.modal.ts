import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { OpModalLocalsMap } from 'core-app/shared/components/modal/modal.types';
import { OpModalComponent } from 'core-app/shared/components/modal/modal.component';
import { OpModalLocalsToken } from 'core-app/shared/components/modal/modal.service';
import { I18nService } from 'core-app/core/i18n/i18n.service';
import { WorkPackageResource } from 'core-app/features/hal/resources/work-package-resource';
import { PathHelperService } from 'core-app/core/path-helper/path-helper.service';
import { ActionsService } from 'core-app/core/state/actions/actions.service';
import { shareModalUpdated } from 'core-app/features/work-packages/components/wp-share-modal/sharing.actions';
import { fromEvent } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Component({
  templateUrl: './wp-share.modal.html',
  styleUrls: ['./wp-share.modal.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkPackageShareModalComponent extends OpModalComponent implements OnInit {
  @ViewChild('frameElement') frameElement:ElementRef<HTMLIFrameElement>|undefined;

  private workPackage:WorkPackageResource;
  public frameSrc:string;

  private count:number|null = null;

  text = {
    title: this.I18n.t('js.work_packages.sharing.title'),
    button_close: this.I18n.t('js.button_close'),
  };

  constructor(
    @Inject(OpModalLocalsToken) public locals:OpModalLocalsMap,
    readonly cdRef:ChangeDetectorRef,
    readonly I18n:I18nService,
    readonly elementRef:ElementRef<HTMLElement>,
    readonly pathHelper:PathHelperService,
    readonly actions$:ActionsService,
  ) {
    super(locals, cdRef, elementRef);

    this.workPackage = this.locals.workPackage as WorkPackageResource;
    this.frameSrc = this.pathHelper.workPackageSharePath(this.workPackage.id as string);
  }

  ngOnInit() {
    super.ngOnInit();

    fromEvent(document, 'turbo:frame-render')
      .pipe(
        this.untilDestroyed(),
        filter((evt) => evt.target === this.frameElement?.nativeElement),
        take(1),
      )
      .subscribe(() => {
        this.count = this.getRowCount();
      });
  }

  onClose():boolean {
    if (this.getRowCount() !== this.count) {
      this.actions$.dispatch(shareModalUpdated({ workPackageId: this.workPackage.id as string }));
    }

    return super.onClose();
  }

  private getRowCount():number {
    return this.elementRef.nativeElement.querySelectorAll('#op-share-wp-active-shares > li').length;
  }
}
