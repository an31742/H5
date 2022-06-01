FROM ccr.ccs.tencentyun.com/aiforward_saas_fe/fe_fpms_build:202104290107

COPY . /app/

RUN cd /app && npm install --registry=https://registry.npm.taobao.org
