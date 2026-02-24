import { Injectable, Logger, OnModuleInit, RequestMethod } from '@nestjs/common';
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import {
    SUMMARY_KEY,
    type SummaryMetadata,
} from '../../decorators/summary.decorator';

@Injectable()
export class ControllerDiscoveryService implements OnModuleInit {
  private readonly logger = new Logger(ControllerDiscoveryService.name);

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
  ) {}

  onModuleInit(): void {
    this.getControllersSummary();
  }


    getControllersSummary() {
        // Quet tat ca controller khi khoi dong, lay ten method + HTTP method + path,
        // thay ten method bang @Summary neu co, sau do tao chuoi permission va log ra.
        const controllers = this.discoveryService.getControllers(); // Lay danh sach wrapper cua tat ca controller

        const listControllers = controllers // Bat dau bien doi danh sach controller
            .map((wrapper) => {
                const instance = wrapper.instance; // Instance thuc te cua controller
                const controllerName = wrapper.metatype?.name; // Ten class cua controller

                if (!instance || !controllerName) {
                    return null; // Bo qua cac wrapper khong co instance hoac khong co ten
                }

                const prototype = Object.getPrototypeOf(instance); // Lay prototype de quet method
                const methodNames = this.metadataScanner
                    .getAllMethodNames(prototype) // Lay tat ca ten method tren prototype
                    .filter(
                        (methodName) =>
                            methodName !== 'constructor' && // Loai bo constructor
                            typeof instance[methodName] === 'function', // Chi giu method la function
                    )
                    .filter((methodName) => {
                        const handler = instance[methodName]; // Ham handler thuc te
                        const hasHttpMethod = Reflect.hasMetadata(
                            METHOD_METADATA,
                            handler,
                        ); // Co decorator HTTP
                        const hasSummary = Reflect.hasMetadata(SUMMARY_KEY, handler); // Co @Summary

                        return hasHttpMethod || hasSummary; // Chi giu method co HTTP hoac Summary
                    });

                const methods = methodNames.map((methodName) => {
                    const handler = instance[methodName]; // Ham handler thuc te
                    const requestMethod = Reflect.getMetadata(METHOD_METADATA, handler) as
                        | RequestMethod
                        | undefined; // Lay HTTP method tu metadata cua Nest
                    const methodPath = Reflect.getMetadata(PATH_METADATA, handler) as
                        | string
                        | undefined; // Lay path cua route tu metadata
                    const summary = Reflect.getMetadata(
                        SUMMARY_KEY,
                        handler,
                    ) as SummaryMetadata | undefined; // Lay metadata @Summary neu co
                    const controllerBase = controllerName.replace(/Controller$/, ''); // Cat suffix Controller

                    return {
                        name: `${toWords(methodName)} ${toWords(controllerBase)}`.trim(), // Ten hien thi: method + controller
                        rawName: methodName, // Ten method goc de tao permission
                        description: summary?.description ?? '', // Mo ta tu @Summary
                        httpMethod:
                            requestMethod !== undefined
                                ? RequestMethod[requestMethod] // Doi enum sang chu
                                : 'ALL', // Mac dinh neu khong co method
                        path: methodPath ?? '', // Path neu co, khong thi rong
                    };
                });

                return {
                    controller: controllerName, // Luu ten controller
                    methods, // Danh sach method da gom metadata
                };
            })
            .filter(
                (
                    item,
                ): item is {
                    controller: string;
                    methods: {
                        name: string;
                        rawName: string;
                        description: string;
                        httpMethod: string;
                        path: string;
                    }[];
                } => Boolean(item), // Loai bo cac item null
            );


        const mappMethodToPermissionPrefix = {
            GET: 'view',
            POST: 'create',
            PUT: 'update',
            DELETE: 'delete',
            PATCH: 'update',
            ALL: 'access',
        } as const; // Map HTTP method sang prefix permission

        const listControllersWithPermissions = listControllers.map((controller) => {
            const controllerKey = toUpperSnake(
                controller.controller.replace(/Controller$/, ''),
            ); // Chuan hoa ten controller: bo 'Controller' + UPPER_SNAKE

            const methodsWithPermissions = controller.methods.map((method) => {
                const permissionPrefix =
                    mappMethodToPermissionPrefix[
                    method.httpMethod as keyof typeof mappMethodToPermissionPrefix
                    ]; // Lay prefix theo HTTP method
                const methodKey = toUpperSnake(method.rawName); // Chuan hoa ten method goc

                return {
                    ...method, // Giu lai metadata cu
                    permission: permissionPrefix
                        ? `${permissionPrefix}:${controllerKey}:${methodKey}` // Tao chuoi permission theo format yeu cau
                        : undefined, // Neu khong co prefix thi bo trong
                };
            });

            return {
                ...controller, // Giu thong tin controller
                methods: methodsWithPermissions, // Ghi de methods da co permission
            };
        });

        // this.logger.log(
        //     `Discovered controllers: ${JSON.stringify(listControllersWithPermissions)}`,
        //     'ControllerDiscovery',
        // ); // Log ket qua discovery

        return listControllersWithPermissions
    }
}

function toUpperSnake(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2') // Chen dau '_' giua camelCase
    .replace(/[^A-Za-z0-9]+/g, '_') // Chuan hoa ky tu khong hop le
    .replace(/^_+|_+$/g, '') // Bo dau '_' o dau/cuoi
    .replace(/_+/g, '_') // Gom nhieu '_' lien tiep
    .toUpperCase(); // Doi thanh UPPER_SNAKE
}

function toWords(value: string): string {
    return value
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/[^A-Za-z0-9]+/g, ' ')
        .trim()
        .replace(/\s+/g, ' ')
        .toLowerCase();
}
