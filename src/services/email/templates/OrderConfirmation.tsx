import * as React from 'react';
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import { formatPrice, translateForRegion } from '@/lib/utils';

interface Props {
  region: string;
  orderNumber: string;
  items: { name: string, price: string, quantity: number, subtotal: string, paidPrice: string }[]
  orderDate: string;
  orderTotal: string;
  shippingAddress: string;
  shippingPrice: string;
  totalSaved: number;
  discount?: {
    code?: string;
    amount: string;
  };
}



const OrderConfirmationEmail: React.FC<Readonly<Props>> = async ({ region, orderNumber, items, orderDate, orderTotal, shippingAddress, discount, shippingPrice, totalSaved }) => {

  const t = translateForRegion(region, 'ConfirmationEmailTemplate');

  return (
    <Html>
      <Head />
      <Preview>{t('preview', { orderNumber })}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="max-w-[600px] mx-auto bg-white rounded-[8px] overflow-hidden">
            {/* Header */}
            <Section className="bg-[#023d79] px-[24px] py-[32px] text-center">
              <Heading className="text-[24px] font-bold text-white m-0">
                {t('title')}
              </Heading>
              <Text className="text-white m-0">
                {t('order_number_label', { orderNumber })}
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="px-[24px] py-[32px]">
              <Text className="text-[#1d1d1b] text-[16px]">
                {t('greeting')}
              </Text>
              <Text className="text-[#1d1d1b] text-[16px]">
                {t('confirmation_message')}
              </Text>

              {/* Order Summary */}
              <Heading className="text-[18px] font-bold text-[#023d79] mt-[32px] mb-[16px]">
                {t('order_summary')}
              </Heading>

              <Section className="border border-solid border-gray-200 rounded-[8px] px-[16px] py-[16px] mb-[24px]">
                <Row>
                  <Column>
                    <Text className="text-[#1d1d1b] font-bold m-0">{t('order_number')}</Text>
                  </Column>
                  <Column>
                    <Text className="text-[#1d1d1b] m-0 text-right">{orderNumber}</Text>
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <Text className="text-[#1d1d1b] font-bold m-0">{t('order_date')}</Text>
                  </Column>
                  <Column>
                    <Text className="text-[#1d1d1b] m-0 text-right">{orderDate}</Text>
                  </Column>
                </Row>
                <Row>
                  <Column>
                    <Text className="text-[#1d1d1b] font-bold m-0">{t('order_total')}</Text>
                  </Column>
                  <Column>
                    <Text className="text-[#1d1d1b] m-0 text-right">{orderTotal}</Text>
                  </Column>
                </Row>
              </Section>

              {/* Order Items */}
              <Heading className="text-[18px] font-bold text-[#023d79] mt-[32px] mb-[16px]">
                {t('items_ordered')}
              </Heading>

              <Section className="border border-solid border-gray-200 rounded-[8px] overflow-hidden mb-[24px]">
                {/* Table Header */}
                <Row className="bg-gray-100 border-b border-solid border-gray-200">
                  <Column className="px-[12px] py-[12px]">
                    <Text className="text-[#1d1d1b] font-bold m-0">{t('product')}</Text>
                  </Column>
                  <Column className="px-[12px] py-[12px]">
                    <Text className="text-[#1d1d1b] font-bold m-0 text-right">{t('price')}</Text>
                  </Column>
                  <Column className="px-[12px] py-[12px]">
                    <Text className="text-[#1d1d1b] font-bold m-0 text-right">{t('quantity')}</Text>
                  </Column>
                  <Column className="px-[12px] py-[12px]">
                    <Text className="text-[#1d1d1b] font-bold m-0 text-right">{t('subtotal')}</Text>
                  </Column>
                </Row>

                {/* Table Items */}
                {items.map((item, index) => {
                  const hasDiscount = item.paidPrice !== item.price;

                  return (
                    <Row key={index} className="border-b border-solid border-gray-200 last:border-b-0">
                      <Column className="px-[12px] py-[12px]">
                        <Text className="text-[#1d1d1b] m-0">{item.name}</Text>
                      </Column>
                      <Column className="px-[12px] py-[12px]">
                        <div style={{ textAlign: 'right' }}>
                          {/* Precio pagado (siempre visible) */}
                          <Text className="text-[#1d1d1b] m-0 text-right">{item.paidPrice}</Text>
                          {/* Precio original (solo si hay descuento) */}
                          {hasDiscount && (
                            <Text className="text-[#666666] text-[12px] m-0 text-right" style={{ textDecoration: 'line-through' }}>
                              {item.price}
                            </Text>
                          )}
                        </div>
                      </Column>
                      <Column className="px-[12px] py-[12px]">
                        <Text className="text-[#1d1d1b] m-0 text-right">{item.quantity}</Text>
                      </Column>
                      <Column className="px-[12px] py-[12px]">
                        <Text className="text-[#1d1d1b] m-0 text-right">{item.subtotal}</Text>
                      </Column>
                    </Row>
                  );
                })}

                {discount && (
                  <Row className="border-b border-solid border-gray-200 last:border-b-0">
                    <Column className="px-[12px] py-[12px]" colSpan={3}>
                      <Text className="text-[#1d1d1b] m-0 text-left">{t('discount_code')} {discount.code}</Text>
                    </Column>
                    <Column className="px-[12px] py-[12px]">
                      <Text className="text-[#1d1d1b] m-0 text-right"> - {discount.amount}</Text>
                    </Column>
                  </Row>
                )}

                {/* shippingPrice */}
                <Row className="border-b border-solid border-gray-200 last:border-b-0">
                  <Column className="px-[12px] py-[12px]" colSpan={3}>
                    <Text className="text-[#1d1d1b] m-0 text-left">{t('shippingPrice')}</Text>
                  </Column>
                  <Column className="px-[12px] py-[12px]">
                    <Text className="text-[#1d1d1b] m-0 text-right">{shippingPrice}</Text>
                  </Column>
                </Row>
                <Row className="bg-gray-100">
                  <Column className="px-[12px] py-[12px]" colSpan={3}>
                    <Text className="text-[#1d1d1b] font-bold m-0 text-right">{t('total')}</Text>
                  </Column>
                  <Column className="px-[12px] py-[12px]">
                    <Text className="text-[#1d1d1b] font-bold m-0 text-right">{orderTotal}</Text>
                  </Column>
                </Row>
              </Section>


              {(totalSaved > 0) && (
                <Section className="border border-solid border-gray-200 rounded-[8px] overflow-hidden mb-[24px] bg-gray-50">
                  <Row>
                    <Column className="px-[16px] py-[12px]" colSpan={2}>
                      <Text className="text-green-600 font-medium text-center m-0">
                        {t('you_saved', { amount: formatPrice(totalSaved) })}
                      </Text>
                    </Column>
                  </Row>
                </Section>
              )}

              {/* Shipping Information */}
              <Heading className="text-[18px] font-bold text-[#023d79] mt-[32px] mb-[16px]">
                {t('shipping_information')}
              </Heading>

              <Section className="border border-solid border-gray-200 rounded-[8px] px-[16px] py-[16px] mb-[24px]">
                <Text className="text-[#1d1d1b] m-0">{shippingAddress}</Text>
              </Section>

              {/* CTA */}
              {/* <Section className="text-center mt-[32px] mb-[24px]">
                <Button
                  href="https://example.com/track-order"
                  className="bg-[#023d79] text-white font-bold px-[24px] py-[12px] rounded-[4px] no-underline text-center box-border"
                >
                  {t('track_order')}
                </Button>
              </Section> */}

              <Text className="text-[#1d1d1b] text-[16px]">
                {t('thank_you_message')}
              </Text>
            </Section>

            {/* Footer */}
            <Section className="bg-gray-100 px-[24px] py-[24px] text-center">
              <Text className="text-[#1d1d1b] text-[14px] m-0">
                {t('copyright')}
              </Text>
              <Text className="text-[#1d1d1b] text-[14px] m-0">
                {t('store_address')}
              </Text>
              <Text className="text-[#1d1d1b] text-[14px] m-0">
                <Link href="https://example.com/unsubscribe" className="text-[#023d79]">
                  {t('unsubscribe')}
                </Link>{' '}
                •{' '}
                <Link href="https://example.com/privacy" className="text-[#023d79]">
                  {t('privacy_policy')}
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default OrderConfirmationEmail;